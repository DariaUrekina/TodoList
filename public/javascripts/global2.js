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
}

function TaskView() {
    Component.call(this);    
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
    var that=this;
    $('#btnAddTask').on('click', function(event) {
        event.preventDefault();
        that.emit('addTask', {
            'name' : $('#addTask input').val()
        });
        $('#addTask input').val('');
    });
}



function TaskSettingsView() {
    Component.call(this);
}



function ListSettingsView() {
    Component.call(this);
}   

function ListData() {
    Component.call(this);
    var that = this;
    var listByLists = [];
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

    this.on('addList', this.onAddList);
    this.on('LoadLists', this.onLoadLists);
}

function TaskData(){
    Component.call(this);
    var that=this;
    var selectedListById;
    
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
        sendAjaxPost('/tasks' , newTask, function(task) {
            listByTasks.push(task);
            that.emit('showTasks', listByTasks);
        })
    }
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


