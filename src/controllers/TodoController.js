
class TodoController {

    index(request, response) {
        response.send({ message: "Get All Todos" })
    }

}

export default new TodoController