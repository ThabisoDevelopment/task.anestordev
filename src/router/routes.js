import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import AuthController from "../controllers/AuthController"
import TaskController from "../controllers/TaskController"

// initiate express router
const router = Router()

// auth routes
router.post('/oauth/login', AuthController.login)
router.post('/oauth/register', AuthController.create)

// Task Routes
router.get('/tasks', Token.verify, TaskController.index)
router.get('/tasks/:id', Token.verify, TaskController.show)
router.post('/tasks', Token.verify, TaskController.create)
router.put('/tasks/:id', Token.verify, TaskController.update)
router.delete('/tasks/:id', Token.verify, TaskController.destroy)
router.put('/tasks/completed/:id', Token.verify, TaskController.completed)


export default router