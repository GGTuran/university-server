import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicSemesterSearchableFields, academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    //checking the semester name and code
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester code');
    };

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>,) => {
    const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
        .search(AcademicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id);
    return result;
};

const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
    //checking the semester name and code
    if (payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester code');
    };

    const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, { new: true });
    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB,
};