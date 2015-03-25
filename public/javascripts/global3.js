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
    this.schedule = {}; //объект колбэков связынных с событиями 
    this.emit = function(event, options) { //инициирует событие
        console.log(event);
        $.each(this.schedule[event], function(callback) { //для каждого колбэка вызывается функция которая вызывает этот колбэк
            this(options);
        });
    };
    this.on = function(event, callback) { //связывание события с действием 
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
    this.onShowLists = function(listByLists) {
        //sendAjaxUpdate('/lists', listByLists, function(list){
            var liContent='';
            $.each(listByLists, function(list){
                liContent+='<li data-listname="' + this.name+'"' + 'data-listid="'+this['_id']+'">' +  this.name +  '<i class="fa fa-times"></i>'+'</li>'; 
            });
            this.listElement.html(liContent);
       // })
        
    };
    
    this.on('showLists', this.onShowLists);
    this.emit('LoadLists', {});

    var that = this;
    $('#addList ul').click(function(event) {
        if (event.target.tagName === 'LI') {
            that.emit('LoadTasks', {
                id:event.target.dataset.listid
            });                  
        }
    });

    $('#btnAddList').on('click', function(event) {
        event.preventDefault();        
        that.emit('addList', {
            'name' : $('#addList input').val()
        });
        $('#addList input').val('');
    });    

    $('#addList ul').on('click', function(event) {
        if (event.target.tagName=='I'){
            that.emit('removeList', {
                id:event.target.parentNode.dataset.listid
            });
        }
    });

   
    $('#addList ul').dblclick(function(event) {
        if(event.target.tagName=='LI') {
            $('#dialogList').dialog('open');
            that.emit('PutListNameInInput', {
                id:event.target.dataset.listid
            });
        }
    }); 

}

function TaskView() {
    Component.call(this);    
    var that=this;
    var checkbox;
    this.onShowTasks = function(listByTasks) {
        var liContent='';
        $.each(listByTasks, function(task) {
            if (typeof this.expireAt==='undefined') {
                this.expireAt='';
            }
            if (typeof this.expireAt !='undefined') {
                this.expireAt= moment(this.expireAt).format('DD/MM/YYYY') ;
            }       
            if (this.done) {
                checkbox= '<input type="checkbox" checked>'
            } else {
                checkbox = '<input type="checkbox">';
            }
            liContent+='<li data-taskid="' + this['_id']+'">' + checkbox  + '<span class="taskname">' + this.name + '</span>' +'<span class="expire-at">' + this.expireAt + '</span>' + '<i class="fa fa-times"></i>'+ '</li>';
        });
        $('#addTask ul').html(liContent);
    };
    this.on('showTasks', this.onShowTasks);

    $('#btnAddTask').on('click', function(event) {
        event.preventDefault();          
        that.emit('addTask', {
            task: {
                'name': $('#addTask input').val()
            } 
        });
        $('#addTask input').val('');
    });

    $('#addTask ul').on('click', function(event) {
        if (event.target.tagName=='I'){
            that.emit('removeTask', {
                id:event.target.parentNode.dataset.taskid
            });
        };
        if (event.target.tagName=='INPUT') {
            that.emit('ifDoneTask', {
                id:event.target.parentNode.dataset.taskid,
                done: event.target.checked
            });
        }
    });

    $('#addTask ul').dblclick(function(event) {
        if(event.target.tagName=='LI') {
            $('#dialogTask').dialog('open');
            that.emit('PutTaskNameInDialog', {
                id:event.target.dataset.taskid
            });
        }
    });    
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
   
    this.onShowNewTaskName = function(task) {
        that.task=task[0];
        $('#ui-id-1').html(that.task.name);
    }
    
    $('#datepicker_setdate' ).datepicker({     
        onSelect: function(date) {                
            that.emit('setDate', {
                id:that.task._id, 
                date: date 
            });
        }
    });

    $('#subtask').on('ckick', function(event) {
        event.preventDefault();
    });

    this.on('ShowNewTaskName', this.onShowNewTaskName);


}

function ListSettingsView() {
    Component.call(this);
    var that=this;
    this.list=[];
    
    $('#dialogList').dialog({
        autoOpen:false,
        closeOnEscape:true,
    });  

    this.onShowNewListName = function(list) {
        console.log(list);
        that.list=list[0];
        $('#name').val(that.list.name);
    }
    
    $('.btnReady').on('click', function(event) {
        event.preventDefault();
        that.emit('ChangeListName', {
            id:that.list._id,
            name: $('#name').val()
        });
        $('#dialogList').dialog('close');
    }); 

    this.on('ShowNewListName', this.onShowNewListName);
}   

function ListData() {
    Component.call(this);
    var that = this;
    var listByLists = []; 
    var selectedListById;
    var selectedListByName;
    this.onAddList = function (newList) {
        if (newList.name!=''){
            sendAjaxPost('/lists', newList, function(list) {
                listByLists.push(list);                
                that.emit('showLists', listByLists);
            });
        }   
    }
     
    this.onLoadLists = function(){
        $.getJSON('/lists', function(data) {    
            listByLists = data;
            that.emit('showLists', listByLists);
        });
    };

    this.onRemoveLists = function(options) {
        sendAjaxDelete('/lists/' + options.id, function() {
            listByLists=listByLists.filter(function(list){
                return list._id!=options.id;
            });
            that.emit('showLists', listByLists);
        });
    }

    this.onPutListNameInInput = function(options) { 
        selectedListById=listByLists.filter(function(list) {
           return  list._id==options.id;           
        });         
        that.emit('ShowNewListName', selectedListById)
    }

    this.onChangeListName = function(options) {
        sendAjaxUpdate('/lists/' + options.id, {name:options.name}, function(list){
            for (var i = 0; i < listByLists.length; i++) {
                if (listByLists[i]._id === options.id) {
                    listByLists[i].name = options.name;
                }
            } 
            that.emit('showLists', listByLists);      
        });
    }

    this.on('ChangeListName', this.onChangeListName);
    this.on('PutListNameInInput', this.onPutListNameInInput);
    this.on('removeList', this.onRemoveLists);
    this.on('addList', this.onAddList);
    this.on('LoadLists', this.onLoadLists);
}

function TaskData(){
    Component.call(this);
    var that=this;
    var selectedListById;
    var selectedTaskById;
    var listByTasks=[];
    this.onLoadTasks = function(options){
        $.getJSON('/lists/' + options.id, function(data) {
            listByTasks= data;
            selectedListById=options.id;
            that.emit('showTasks', listByTasks);
        });
    };
    this.onAddTask = function(newTask) {
        newTask.list_id=selectedListById;
        if (newTask.task.name!='') {
            sendAjaxPost('/tasks' , newTask, function(task) {
                listByTasks.push(task);
                that.emit('showTasks', listByTasks);
            });
        }    
    }

    this.onRemoveTask = function(options) {
        sendAjaxDelete('/tasks/' + options.id, function() {
            listByTasks = listByTasks.filter(function(task) {
                return task._id != options.id;
            });
            that.emit('showTasks', listByTasks);
        });
    }

    this.onPutTaskNameInDialog = function(options) {
        selectedTaskById = listByTasks.filter(function(task){
            return task._id==options.id;
        });
        that.emit('ShowNewTaskName', selectedTaskById)
    }

    this.onSetDate = function(options) {
        sendAjaxUpdate('/tasks/' + options.id, {expireAt: options.date}, function(task){ 
            for (var i=0; i<listByTasks.length; i++){
                if (listByTasks[i]._id === options.id) {
                    listByTasks[i].expireAt=options.date;
                }
            }
            that.emit('showTasks', listByTasks);    
        });
    }

    this.onIfDoneTask = function(options) {
        for (var i=0; i<listByTasks.length; i++) {
            if (listByTasks[i]._id===options.id) {
                listByTasks[i].done=options.done;
                var tmp = listByTasks[i];
                listByTasks.splice(i,1);
                listByTasks.push(tmp);
                console.log(listByTasks);
            } 
        }
        that.emit('showTasks', listByTasks);
    }   

    this.on('ifDoneTask', this.onIfDoneTask);
    this.on('setDate', this.onSetDate); 
    this.on('PutTaskNameInDialog', this.onPutTaskNameInDialog);
    this.on('removeTask', this.onRemoveTask);
    this.on('addTask', this.onAddTask);
    this.on('LoadTasks', this.onLoadTasks);
}

var TaskData = new TaskData();
var ListData = new ListData();
var listView = new ListView();
var taskView = new TaskView();
var taskSettingsView = new TaskSettingsView();
var listSettingsView = new ListSettingsView();
});