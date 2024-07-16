import { ResourceWithOptions } from "adminjs";
import { Category, Course, Episode, User } from "../../models";
import { categoryResourceOptions } from "./Category";
import { courseResourceFeatures, courseResourceOptions } from "./Course";
import { episodeResourceFeatures, episodeResourceOptions } from "./Episode";
import { userResourceOptions } from "./User";

export const adminJsResourcesOptions: ResourceWithOptions[] = [
    {
        resource: Category,
        options: categoryResourceOptions
    },
    {
        resource: Course,
        options: courseResourceOptions,
        features: courseResourceFeatures
    },
    {
        resource: Episode,
        options: episodeResourceOptions,
        features: episodeResourceFeatures
    },
    {
        resource: User,
        options: userResourceOptions
    }
]