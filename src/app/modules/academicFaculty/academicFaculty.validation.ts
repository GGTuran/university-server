import { z } from "zod";

const createAcademicFacultyZod = z.object({
    body:z.object({
        name:z.string({invalid_type_error:'Academic faculty must be string'}),
    }),
});
const updateAcademicFacultyZod = z.object({
    body:z.object({
        name:z.string({invalid_type_error:'Academic faculty must be string'}),
    }),
});

export const academicFacultyValidation = {
    createAcademicFacultyZod,
    updateAcademicFacultyZod,
}
