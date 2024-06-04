import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { studentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFacultyRoutes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";

const router = Router();

const moduleRoutes = [
    {
        path:'/users',
        route:UserRoutes,
    },
    {
        path:'/students',
        route:studentRoutes,
    },
    {
        path:'/faculties',
        route:FacultyRoutes,
    },
    {
        path:'/semesters',
        route:AcademicSemesterRoutes,
    },
    {
        path:'/academic-faculties',
        route:AcademicFacultyRoutes
    },
    {
        path:'/departments',
        route:AcademicDepartmentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;