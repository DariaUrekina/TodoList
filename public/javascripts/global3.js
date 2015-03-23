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

function Dispatcher() {
    this.schedule = {}; //объект колбэков связынных с событиями 
    this.emit = function(event, options) { //инициирует событие
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
        console.log(event);
        dispatcher.on(event, callback.bind(this));        
    };
}



function ListView() {
    Component.call(this);
    this.listElement = $('#addList ul');
    this.onShowLists = function(listByLists) {
        console.log(listByLists);
        var liContent='';
        $.each(listByLists, function(list){
            liContent+='<li data-listname="' + this.name+'"' + 'data-listid="'+this['_id']+'">' +  this.name +  '<i class="fa fa-times"></i>'+'</li>'; 
        });
        this.listElement.html(liContent);
    };
    
    this.on('showLists', this.onShowLists);
    this.emit('LoadLists', {});

    var that = this;
    $('#addList ul').click(function(event) {
        if (event.target.tagName === 'LI') {
            that.emit('LoadTasks', {id:event.target.dataset.listid});                  
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
            that.emit('removeList', {id:event.target.parentNode.dataset.listid})
        }
    });

    $('#addList ul').dblclick(function(event) {
        if (event.target.tagName=='LI') {       
            $('#dialogList').dialog('open');
            that.emit('removeTask', {id:event.target.parentNode.dataset.listid})
        }
    });

}

function TaskView() {
    Component.call(this);    
    var that=this;
    this.taskElement = $('#addTask ul');
    this.onShowTasks = function(listByTasks) {
        var liContent='';
        $.each(listByTasks, function(task) {
            if (typeof this.expireAt==='undefined') {
                this.expireAt='';
            }
            liContent+='<li data-taskname="'+ this.name+'"'+ 'data-taskid="' + this['_id']+'">' + '<input type="checkbox">' + this.name + this.expireAt + '<i class="fa fa-times"></i>'+ '</li>';
        });
        this.taskElement.html(liContent);
    };
    this.on('showTasks', this.onShowTasks);

    $('#btnAddTask').on('click', function(event) {
        event.preventDefault();
        that.emit('addTask', {
            task: {
                name: $('#addTask input').val()
            } 
        });
        $('#addTask input').val('');
    });

    $('#addTask ul').on('click', function(event) {
        if (event.target.tagName=='I'){
            that.emit('removeTask', {id:event.target.parentNode.dataset.taskid})
        }
    });

    $

    $("#datepicker_setdate" ).datepicker({
        onSelect: function(date) {
           console.log(date);
        }
    });
}



function TaskSettingsView() {
    Component.call(this);
    var that=this;
    $('#dialogTask').dialog({
        autoOpen:false,
        closeOnEscape:true,
        height: 600,
        width:300,
        position: { my: "right top", at: "right top", of: window },
        show: { effect: "drop", direction: "right" },
        hide: { effect: "drop", direction: "right" }
    });
    $('#addTask ul').dblclick(function(event) {
        if (event.target.tagName=='LI') {
            $('#dialogTask').dialog('open');
            that.emit('changeTaskName', {
                id:event.target.dataset.taskid,
                name:event.target.dataset.taskname
            });
        }
    });

}

function ListSettingsView() {
    Component.call(this);
    var that=this;
    $('#addList ul').dblclick(function(event) {
        if(event.target.tagName=='LI') {
            $('#dialogList').dialog('open');
            that.emit('PutListNameInInput', {
                id:event.target.dataset.listid,
                name:event.target.dataset.listname
            });
            that.emit('ChangeListName', {
                id: event.target.dataset.listid
            });
           
        }
    });   

    $('#dialogList').dialog({
        autoOpen:false,
        closeOnEscape:true,
    });    
}   

function ListData() {
    Component.call(this);
    var that = this;
    var listByLists = []; 
    var selectedListById;
    var selectedListByName;
    this.onAddList = function (newList) {
        sendAjaxPost('/lists', newList, function(list) {
            listByLists.push(list);
            that.emit('showLists', listByLists);
        });
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

    this.onPutListNameInInput = function(list) {        
        selectedListByName=list.name;
        $('#name').val(selectedListByName);
        that.emit('showLists', listByLists);
    }

    this.onChangeListName = function(list) {
        selectedListById=list.id;
        var currentList = $("li[data-listid='"+selectedListById+"']");
        currentList.html($('#name').val() +  '<i class="fa fa-times"></i>');
        currentList.attr("data-listname", function(i, origValue) {
            return $('#name').val();
        }); 

        that.emit('showLists', listByLists);
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
    var selectedTaskByName;
    var listByTasks=[];
    this.onLoadTasks = function(options){
        $.getJSON('/lists/' + options.id, function(data) {
            listByTasks= data;
            selectedListById=options.id;
            console.log(selectedListById);
            that.emit('showTasks', listByTasks);
        });
    };
    this.onAddTask = function(newTask) {
        newTask.list_id=selectedListById;
        sendAjaxPost('/tasks' , newTask, function(task) {
            listByTasks.push(task);
            that.emit('showTasks', listByTasks);
        })
    }

    this.onRemoveTask = function(options) {
        sendAjaxDelete('/tasks/' + options.id, function() {
            listByTasks = listByTasks.filter(function(task) {
                return task._id != options.id;
            });
            that.emit('showTasks', listByTasks);
        });
    }

    this.onChangeTaskName = function(options) {
        selectedTaskById=options.id;
        selectedTaskByName=options.name;
        $("#ui-id-1").html(selectedTaskByName); 
        console.log(selectedTaskById);
        console.log(selectedTaskByName);
    }

    this.on('changeTaskName', this.onChangeTaskName);   
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


