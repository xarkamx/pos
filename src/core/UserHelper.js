class UserHelper {
    getIdUserWithUrl() {
        var url = document.URL;
        var response = url.split("/");
        return response['6'];
    }
}