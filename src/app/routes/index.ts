import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { studentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFacultyRoutes";

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
        path:'/semesters',
        route:AcademicSemesterRoutes,
    },
    {
        path:'/faculties',
        route:AcademicFacultyRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;