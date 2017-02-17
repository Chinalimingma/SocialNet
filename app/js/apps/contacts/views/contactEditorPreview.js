'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactEditorPreview.tpl');

/**
 * Responsible for creating all the necessary views with the model or collection that is passed,
   rendering the views in a region of the DOM and listening for events in the views
 */
class ContactPreview extends ModelView {
    constructor(options) {
        super(options);
        this.template = template;

        
        this.model.on('change', this.render, this);

        if (options.controller) {
            this.listenTo(
                options.controller, 'avatar:uploading:start',
                this.uploadingAvatarStart, this
            );
            this.listenTo(
                options.controller, 'avatar:uploading:done',
                this.uploadingAvatarDone, this
            );
            this.listenTo(
                options.controller, 'avatar:uploading:error',
                this.uploadingAvatarError, this
            );

            this.listenTo(
                options.controller, 'avatar:uploading:progress',
                this.uploadingAvatarProgress, this
            );
         }
    }
    get className() {
        return "box thumbnail";//<div class='box thumbnail'>....</div>
    }

    get events() {
        return {
            'click img': 'showSelectFileDialog',//Triggers a click event on the input
            'change #avatar': 'fileSelected'//Triggers a change event on the file input
        };
    }

    showSelectFileDialog() {
        this.$('#avatar').trigger('click');//The input control opens Select File dialog
    }

    fileSelected(event) {
        
        event.preventDefault();

        var $img = this.$('img');

        // Get a blob instance of the file selected
        var $fileInput = this.$('#avatar')[0];//获取到文件列表
        //Has any file been selected yet?
        if ($fileInput.files === undefined || $fileInput.files.length == 0) {
            alert("Please select a file");
            return;
        }
        //We will upload only one file 
        var fileBlob = $fileInput.files[0];

        /**
         * 当您获取了File引用后，实例化FileReader对象，以便将其内容读取到内存中。
           加载结束后，将触发读取程序的 onload 事件，而其 result 属性可用于访问文件数据。
         */
        // Render the image selected in the img tag
        var fileReader = new FileReader();//FileReader is used to read the contents of 
                                          //a Blob or File        
        fileReader.onload = event => {
            //Called when a read operation successfully completes.
            $img.attr('src', event.target.result);//将“src”属性设为数据网址来呈现缩略图
            $img.attr('alt', fileBlob.name);
            if (this.model.isNew()) {
                this.model.set({
                    avatar: {
                        url: event.target.result
                    }
                });
            }
        };
        fileReader.readAsDataURL(fileBlob);//读取结果data:[<media type>][;base64],<data>
        /**
        views should not talk to the server directly; for this reason, the view should
        not make any AJAX calls and trigger event to contactEditor
        **/
        this.trigger('avatar:selected', fileBlob);
    }

    uploadingAvatarStart() {
        this.originalAvatarMessage = this.$('span.info').html();//this.$("#progressbar").show()
        this.$('span.notice').html('Uploading avatar...');
    }

    uploadingAvatarDone() {
        //this.$("#progressbar").hide()
        this.$('span.notice').html(this.originalAvatarMessage || '');
    }

    uploadingAvatarError() {
        this.$('span.notice').html('Can\'t upload image, try again later');
    }

    uploadingAvatarProgress() {
        // $('#progressbar').progressbar("option", "value", percent);
    }
}

module.exports = ContactPreview;
