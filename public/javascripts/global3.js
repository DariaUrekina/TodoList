$(function() {
"use strict";    

function sendAjaxPost(url, data, callback) { 
    $.ajax({
        type: 'POST',
        data: data,
        url:url,
        dataType: 'JSON'
    }).done(callback);          
}

function sendAjaxDelete(url,callback) {
    $.ajax({
        type:'DELETE',
        url:url
    }).done(callback);
}

function sendAjaxUpdate(url, data, callback) {
    $.ajax({
        type:'PUT',
        data:data,
        url:url,
        dataType:'JSON'
    }).done(callback);
}

function Dispatcher() {
    this.schedule = {}; 
    this.emit = function(event, options) { 
        console.log(event, options);
        $.each(this.schedule[event], function(callback) { 
            this(options);
        });
    };
    this.on = function(event, callback) {
        if ( typeof this.schedule[event] !== 'undefined') {
            this.schedule[event].push(callback);
        }
        else this.schedule[event]=[callback];
    }
}

var dispatcher = new Dispatcher();


function Component() { 
    this.emit= function(event, options) {
        dispatcher.emit(event, options);
    };
    this.on= function(event, callback) {
        dispatcher.on(event, callback.bind(this));        
    };
}

function ListView() {
    Component.call(this);
    this.listElement = $('#addList ul');
    this.onUpdatedListItem = function(listByLists) {
            var liContent='';
            $.each(listByLists, function(list){
                liContent+='<li data-listname="' + this.name+'"' + 'data-listid="'+this['_id']+'">' +  this.name +  '<i class="fa fa-times"></i>'+'</li>'; 
            });
            this.listElement.html(liContent);
            
    };
    
    this.on('UpdatedListItem', this.onUpdatedListItem);
    this.emit('InitListView', {});

    var that = this;
    $('#addList ul').click(function(event) {
        if (event.target.tagName === 'LI') {
            that.emit('ClickedListItem', {
                id:event.target.dataset.listid
            });                  
        }
        if (event.target.tagName=='I'){
            that.emit('RemovedListItem', {
                id:event.target.parentNode.dataset.listid
            });
        }
    });

    $('#btnAddList').on('click', function(event) {
        event.preventDefault();        
        that.emit('AddedListItem', {
            'name' : $('#addList input').val()
        });
        $('#addList input').val('');
    });    

    $('#addList ul').dblclick(function(event) {
        if(event.target.tagName=='LI') {
            $('#dialogList').dialog('open');
            that.emit('DblClickedListItem', {
                id:event.target.dataset.listid
            });
        }
    }); 

}

function TaskView() {
    Component.call(this);    
    var that=this;
    var checkbox;
    this.onUpdatedTaskItems = function(listByTasks) {
        var liContent='';       
        $.each(listByTasks, function(task) {
            var formatedExpireAt;
            if (typeof this.expireAt==='undefined') {
                formatedExpireAt='';
            } else 
            if (typeof this.expireAt !='undefined') {
                formatedExpireAt = moment(this.expireAt).format('DD/MM/YYYY') ;
            }       
            if (this.done) {
                checkbox= '<input type="checkbox" checked>'
            } else {
                checkbox = '<input type="checkbox">';
            }
            liContent+='<li  data-taskid="' + this['_id']+'">' + checkbox  + '<span class="taskname">' + this.name + '</span>' +'<span class="expire-at">' + formatedExpireAt + '</span>' + '<i class="fa fa-times"></i>'+ '</li>';
        });
        $('#addTask ul').html(liContent);
    };


    $('#btnAddTask').on('click', function(event) {
        event.preventDefault();          
        that.emit('AddedTaskItem', {
            task: {
                'name': $('#addTask input').val()
            } 
        });
        $('#addTask input').val('');
    });

    $('#addTask ul').on('click', function(event) {
        if (event.target.tagName=='I'){
            that.emit('RemovedTaskItem', {
                id:event.target.parentNode.dataset.taskid
            });
        };
        if (event.target.tagName=='INPUT') {
            that.emit('CheckedTaskItem', {
                id:event.target.parentNode.dataset.taskid,
                done: event.target.checked
            });
        }
    });

    $('#addTask ul').dblclick(function(event) {
        if(event.target.tagName=='LI') {
            $('#dialogTask').dialog('open');
            that.emit('DblClickedTaskItem', {
                id:event.target.dataset.taskid
            });
        }
    });    

    this.on('UpdatedTaskItems', this.onUpdatedTaskItems);
}


function TaskSettingsView() {
    Component.call(this);
    var that=this;
    this.task=[];

    $('#dialogTask').dialog({
        autoOpen:false,
        closeOnEscape:true,
        height: 600,
        width:300,
        position: { my: "right top", at: "right top", of: window },
        show: { effect: "drop", direction: "right" },
        hide: { effect: "drop", direction: "right" }
    });

    $('#my-dropzone').dropzone({
        url: '/upload',
        init: function() {
            var self = this;
            self.options.addRemoveLinks = true;
            self.options.dictRemoveFile = "Delete";

            self.on('addedfile', function(file) {
                console.log('new file added ', file);
            });

            self.on('sending', function(file, xhr, formData) {
                console.log('upload started', that.task);
                formData.append('task_id', that.task._id);
                $('.meter').show();
            });

    
            self.on('totaluploadprogress', function(progress) {
                console.log('progress ', progress); 
                $('.roller').width(progress + '%');
            });

            self.on('queuecomplete', function(progress) {
                $('.meter').delay(999).slideUp(999);
            }); 

            self.on('removeFile', function(file) {
                self.removeFile(file);
            }); 

            //self.options.addedfile(mockFile);
            //self.options.thumbnail(mockFile, files[i].url);         
        }      
    });
   
    this.onSelectedTaskItem = function(task) {
        that.task=task[0];
        $('#ui-id-1').html(that.task.name);
    }
    
    $('#datepicker_setdate' ).datepicker({     
        onSelect: function(date) {                
            that.emit('SelectedDate', {
                id:that.task._id, 
                date: date 
            });
        },
        showAnim: "blind",
        dateFormat: "d MM, y", 
        setDate: null       
    });

    this.on('SelectedTaskItem', this.onSelectedTaskItem);
}

function ListSettingsView() {
    Component.call(this);
    var that=this;
    this.list=[];
    
    $('#dialogList').dialog({
        autoOpen:false,
        closeOnEscape:true,
    });  

    this.onSelectedListItem = function(list) {
        console.log(list);
        that.list=list[0];
        $('#name').val(that.list.name);
    }
    
    $('.btnReady').on('click', function(event) {
        if (event.target.parentNode.checkValidity()) {
            event.preventDefault();
            that.emit('ChangedListName', {
                id:that.list._id,
                name: $('#name').val()
            });
            that.emit('AssignedList', {
                id:that.list._id,
                email: $('#email').val()
            })
            $('#dialogList').dialog('close');
        }
    }); 

    this.on('SelectedListItem', this.onSelectedListItem);
}   

function ListData() {
    Component.call(this);
    var that = this;
    var listByLists = []; 
    var selectedListById;
    var selectedListByName;
    this.onAddedListItem = function (newList) {
        if (newList.name!=''){
            sendAjaxPost('/lists', newList, function(list) {
                listByLists.push(list);                
                that.emit('UpdatedListItem', listByLists);
            });
        }   
    }
     
    this.onInitListView = function(){
        $.getJSON('/lists', function(data) {    
            listByLists = data;
            that.emit('UpdatedListItem', listByLists);
        });
    };

    this.onRemovedListItem = function(options) {
        sendAjaxDelete('/lists/' + options.id, function() {
            listByLists=listByLists.filter(function(list){
                return list._id!=options.id;
            });
            that.emit('UpdatedListItem', listByLists);
        });
    }

    this.onDblClickedListItem = function(options) { 
        selectedListById=listByLists.filter(function(list) {
           return  list._id==options.id;           
        });         
        that.emit('SelectedListItem', selectedListById)
    }

    this.onChangedListName = function(options) {
        sendAjaxUpdate('/lists/' + options.id, {name:options.name}, function(list){
            for (var i = 0; i < listByLists.length; i++) {
                if (listByLists[i]._id === options.id) {
                    listByLists[i].name = options.name;
                }
            } 
            that.emit('UpdatedListItem', listByLists);      
        });
    }

    this.onAssignedList = function(options) {
        sendAjaxPost('users/assigments', {id:options.id}, function(list) { 
            //listByLists.push(list);
            console.log('ooooooooooooooooooooooooooooops')
           // that.emit('UpdatedListItem', listByLists);
        });
    }

    this.on('AssignedList', this.onAssignedList)
    this.on('ChangedListName', this.onChangedListName);
    this.on('DblClickedListItem', this.onDblClickedListItem);
    this.on('RemovedListItem', this.onRemovedListItem);
    this.on('AddedListItem', this.onAddedListItem);
    this.on('InitListView', this.onInitListView);
}

function TaskData(){
    Component.call(this);
    var that=this;
    var selectedListById;
    var selectedTaskById;
    var listByTasks=[];
    var files=[];
    this.onClickedListItem = function(options){
        $.getJSON('/lists/' + options.id, function(data) {
            listByTasks= data;
            selectedListById=options.id;
            that.emit('UpdatedTaskItems', listByTasks);
        });
    };
   
    this.onLoadLists = function(){
        $.getJSON('/lists', function(data) {    
            listByLists = data;
            that.emit('UpdatedListItem', listByLists);
        });
    };    


    this.onAddedTaskItem = function(newTask) {
        newTask.list_id=selectedListById;
        if (newTask.task.name!='') {
            sendAjaxPost('/tasks' , newTask, function(task) {
                listByTasks.push(task);
                that.emit('UpdatedTaskItems', listByTasks);
            });
        }    
    };

    this.onRemovedTaskItem = function(options) {
        sendAjaxDelete('/tasks/' + options.id, function() {
            listByTasks = listByTasks.filter(function(task) {
                return task._id != options.id;
            });
            that.emit('UpdatedTaskItems', listByTasks);
        });
    };

    this.onDblClickedTaskItem = function(options) {
        selectedTaskById = listByTasks.filter(function(task){
            return task._id==options.id;
        });
        that.emit('SelectedTaskItem', selectedTaskById)
    };

    this.onSelectedDate = function(options) {
        sendAjaxUpdate('/tasks/' + options.id, {expireAt: options.date}, function(task){ 
            for (var i=0; i<listByTasks.length; i++){
                if (listByTasks[i]._id === options.id) {
                    listByTasks[i].expireAt=options.date;
                }
            }
            that.emit('UpdatedTaskItems', listByTasks);    
        });
    };

    this.onCheckedTaskItem = function(options) {
        var doneTasks = [];
        sendAjaxUpdate('/tasks/' + options.id, {done:options.done}, function(task) { 
            for (var i=0; i<listByTasks.length; i++) {
                if (listByTasks[i]._id===options.id) {
                    listByTasks[i].done=options.done;
                    doneTasks.push(listByTasks[i]); 
                    console.log(doneTasks);   
                } 
            }
            that.emit('UpdatedTaskItems', listByTasks);
        });    
    };   

    this.on('CheckedTaskItem', this.onCheckedTaskItem);
    this.on('SelectedDate', this.onSelectedDate); 
    this.on('DblClickedTaskItem', this.onDblClickedTaskItem);
    this.on('RemovedTaskItem', this.onRemovedTaskItem);
    this.on('AddedTaskItem', this.onAddedTaskItem);
    this.on('ClickedListItem', this.onClickedListItem);
}


function ImageData() {
    Component.call(this);
    var that = this;
    var mockFile= {};
     this.onShowImages = function(options) {
        $.getJSON('/upload', function(data) {
            files=data;
            for (var i = 0; i < files.length; i++) {
                mockFile = {        
                    name: files[i].name,
                    size: files[i].size
                }
            }  
            that.emit('showImage', mockFile)           
        });
    };
}


var taskData = new TaskData();
var listData = new ListData();
var listView = new ListView();
var taskView = new TaskView();
var imageData = new ImageData();
var taskSettingsView = new TaskSettingsView();
var listSettingsView = new ListSettingsView();
}); 