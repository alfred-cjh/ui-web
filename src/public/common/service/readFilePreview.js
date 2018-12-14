function readFilePreview(self,e,type){
    var file = e.files[0];
    var reg = /\.md$/;
    self.filePath = file.name;
    if (file && reg.test(file.name)) {
        self.imgChecked = false;
        var reader = new FileReader();
        reader.onload = function() {
            //self.imgUrl = this.result;
            self.currentEditor.instan.clear()
            self.currentEditor.instan.setValue(this.result)
            self.imgChecked = false;
            self.$apply();
        }
        reader.readAsText(file);
        e.value = "";
    } else {
        self.imgChecked = true;
    }
    self.$apply();
}
export default readFilePreview;