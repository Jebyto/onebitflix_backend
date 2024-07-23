import { Request, Response } from "express";
import { courseService } from "../services/courseService";
import { getPaginationParams } from "../helpers/getPaginationParams";

export const coursesController = {
    //GET /courses/:id
    show: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const course = await courseService.findByIdWithEpisodes(id);

            return res.json(course);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    },
    //GET /courses/featured
    featured: async (req: Request, res: Response) => {
        try {
            const course = await courseService.getRandomFeaturedCourses();

            return res.json(course);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    },
    //GET /courses/newest
    newest: async (req: Request, res: Response) => {
        try {
            const courses = await courseService.getTopTenNewest();

            return res.json(courses);
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    },
    //GET /courses/search?name=
    search: async (req: Request, res: Response) => {
        const { name } = req.query;
        const [page, perPage] = getPaginationParams(req.query);

        try {
            if(typeof name !== 'string') {
                throw new Error("name must be a string");
            }

            const courses = await courseService.findByName(name, page, perPage);
            return res.json(courses);

        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({message: "Unknown error"});
        }
    }
}