import { Request, Response } from "express";
import { courseService } from "../services/courseService";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { AuthenticatedRequest } from "../middlewares/auth";
import { likeService } from "../services/likeService";
import { favoriteService } from "../services/favoriteService";
import { Course } from "../models";

export const coursesController = {
    //GET /courses/:id
    show: async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user!.id;
        const { id } = req.params;

        try {
            const course = await courseService.findByIdWithEpisodes(id);

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const courseId = Number(id);
            const liked = await likeService.isLiked(userId, courseId);
            const favorited = await favoriteService.isFavorited(userId, courseId);
            return res.json({ ...course.get(), liked, favorited });

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
            if (typeof name !== 'string') {
                throw new Error("name must be a string");
            }

            const courses = await courseService.findByName(name, page, perPage);
            return res.json(courses);

        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: "Unknown error" });
        }
    },
    //GET /courses/popular
    popular: async (req: Request, res: Response) => {
        try {
            const topTen = await courseService.getTopTenByLikes();
            res.json(topTen);
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: "Unknown error" });
        }

    }
}