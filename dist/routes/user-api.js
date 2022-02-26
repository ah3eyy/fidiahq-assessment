"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const router = express_1.default.Router();
exports.UserRouter = router;
router.get('/all-teams', user_controller_1.default.allTeams);
router.get('/team-details/:team_id', user_controller_1.default.teamDetails);
router.get('/completed-fixtures', user_controller_1.default.completedFixtures);
router.get('/pending-fixtures', user_controller_1.default.pendingFixtures);
router.get('/search-fixtures', user_controller_1.default.searchFixtures);
//# sourceMappingURL=user-api.js.map