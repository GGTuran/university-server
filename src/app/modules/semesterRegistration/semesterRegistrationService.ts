import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constants";
import mongoose from "mongoose";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester;

    //check if there is any semester that is already UPCOMING or ONGOING
    const ifThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [
            { status: RegistrationStatus.UPCOMING },
            { status: RegistrationStatus.ONGOING }
        ]
    });
    if (ifThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST,
            `There is already an ${ifThereAnyUpcomingOrOngoingSemester.status}  registered semester!`
        )
    }

    //check if the semester exists
    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This academic semester is not found!!');
    }

    //check if the semester already registered
    const isSemesterRegistered = await SemesterRegistration.findOne({ academicSemester });
    if (isSemesterRegistered) {
        throw new AppError(httpStatus.CONFLICT, 'This semester id already registered!');
    }

    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistrationFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'), query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;
    const meta = await semesterRegistrationQuery.countTotal();
    return {
        meta,
        result
    };
};

const getSingleSemesterRegistrationFRomDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);
    return result;
};

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    /**
 * Step1: Check if the semester is exist
 * Step2: Check if the requested registered semester is exists
 * Step3: If the requested semester registration is ended, we will not update anything
 * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
 * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
 * Step6: If the requested semester registration is 'ENDED' , we will not update anything
 *
 * UPCOMING --> ONGOING --> ENDED
 *
 */

    //first we need to check if the requested registered semester does exist
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Semester does not exist!')
    }

    //if the semester status us ended we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists?.status;
    const requestedStatus = payload?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`);
    }

    //UPCOMING --> ONGOING --> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change your status from ${currentSemesterStatus} to ${requestedStatus}`);
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not change the status from ${currentSemesterStatus} to ${requestedStatus}`);
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;


};

const deleteSemesterRegistrationFromDB = async (id: string) => {
    //checking if the semester registration exist
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'This semester is not registered!')
    }

    //checking if the status is still upcoming
    const semesterRegistrationStatus = isSemesterRegistrationExists.status;
    if (semesterRegistrationStatus !== RegistrationStatus.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update as the registered semester is ${semesterRegistrationStatus}`,
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedOfferedCourse = await OfferedCourse.deleteOne({ semesterRegistration: id }, { session });
        if (!deletedOfferedCourse) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete semester registration');
        }

        const deletedSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id, { session, new: true });
        if (!deletedSemesterRegistration) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete semester registration')
        }

        await session.commitTransaction();
        await session.endSession();
        return null;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error)
    };



}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFRomDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
}