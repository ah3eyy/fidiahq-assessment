"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controllers/admin-controller"));
const router = express_1.default.Router();
exports.AdminRouter = router;
router.post('/create-team', admin_controller_1.default.createTeam);
router.delete('/delete-team/:team_id', admin_controller_1.default.deleteTeam);
router.put('/edit-teams', admin_controller_1.default.editTeam);
router.get('/teams', admin_controller_1.default.teams);
router.get('/team-details/:team_id', admin_controller_1.default.teamDetails);
router.post('/create-fixtures', admin_controller_1.default.createFixtures);
router.delete('/delete-fixtures/:fixture_id', admin_controller_1.default.deleteFixtures);
router.put('/edit-fixtures', admin_controller_1.default.editFixtures);
router.get('/fixtures', admin_controller_1.default.fixtures);
router.get('/fixture-details/:fixture_id', admin_controller_1.default.fixtureDetails);
//# sourceMappingURL=admin-api.js.map