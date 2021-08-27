
class TaskPhaseController {

    index(request, response) {
        response.send({ message: "get all task phase "})
    }

}

export default new TaskPhaseController