import { Category } from "./Category";
import { Course } from "./Course";
import { Episode } from "./Episode";
import { User } from "./User";
import { Favorite } from "./Favorite";
import { Like } from "./Like";

// Categoria - Curso
Category.hasMany(Course, { as: 'courses' });
Course.belongsTo(Category);

// Curso - Episódio
Course.hasMany(Episode, { as: 'episodes' });
Episode.belongsTo(Course);

// Usuário - Favorito - Curso
Course.belongsToMany(User, { through: Favorite });
User.belongsToMany(Course, { through: Favorite });
Course.hasMany(Favorite, { as: 'FavoritesUsers', foreignKey: 'course_id'});
Favorite.belongsTo(Course);
User.hasMany(Favorite, { as: 'FavoritesCourses', foreignKey: 'user_id'});
Favorite.belongsTo(User);

// Usuário - Like - Curso
Course.belongsToMany(User, { through: Like });
User.belongsToMany(Course, { through: Like });

export {
    Category,
    Course,
    Episode,
    User,
    Favorite,
    Like,
}