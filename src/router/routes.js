import { Router } from "express"
import Token from "../middleware/Token"

// Import controllers
import AuthController from "../controllers/AuthController"
import TaskController from "../controllers/TaskController"
import TaskPhaseController from "../controllers/TaskPhaseController"
import TodoController from "../controllers/TodoController"

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

// Tast Phases Routes
router.get('/phases', Token.verify, TaskPhaseController.index)

// Todos Routes
router.get('/todos', Token.verify, TodoController.index)

export default router