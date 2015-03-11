(function() {
var listByTasks = [];
var listByLists=[];
var selectedList=0;
//var currentList=[];
$(document).ready(function() {
    fillList('/tasks', '#addTask ul', function (task){
        return '<li data-taskid=">' + task['_id']+'">' + '<input type="checkbox">' + task.name + '</li>';
    });
    fillList('/lists', '#addList ul', function(list) {
        return '<li data-listid="'+list['_id']+'">' + list.name + '</li>';
    });

    $('#btnAddTask').on('click', addTask);
    $('#btnAddList').on('click', addList);
});

function sendAjaxPost(url, data, callback) { 
    $.ajax({
        type: 'POST',
        data: data,
        url:url,
        dataType: 'JSON'
        }).done(callback);          
}


function sendAjaxGet(url, callback) {
    $.ajax({
        type:'GET',
        url:url 
    }).done(callback);                
}


function fillList(url, selector, callback) {
    var liContent='';
    $.getJSON(url, function(data) { //tasks lists
        listByTasks=data;
         $.each(data, function(){
            liContent+=callback(this); 
        });
        $(selector).html(liContent);
    });   
}

function addTask(event) {
    event.preventDefault();
    var errorCount=0;
    $('#addTask input').each(function(index,val) {
        if ($(this).val()=== '') {errorCount++}
    });
    //console.log(errorCount);
    if (errorCount===0) {
        var newTask = {            
            'task' : {
                'name' : $('#addTask input').val()
            },
            'list_id': selectedList
        } 
        //console.log(newTask);
        sendAjaxPost('/tasks', newTask, function(task) {
            console.log('lol');
            $('#addTask input').val('');
            fillList('/lists/'+selectedList, '#addTask ul', function (task){
                return '<li data-taskid=">' + task['_id']+'">' + '<input type="checkbox">' + task.name + '</li>';
            });
        });       
    }
}

function addList(event) {
    event.preventDefault();
    var errorCount=0;
    $('#addList input').each(function(index,val) {
        if ($(this).val()=== '') {errorCount++}
    });
    //console.log(errorCount);
    if (errorCount===0) {
        var newList = {
            'name' : $('#addList input').val()
        }         
        sendAjaxPost('/lists', newList, function(list) {
            if (list.msg==='') {
                $('#addList input').val('');
                fillList('/lists', '#addList ul', function(list) {
                     return '<li data-listid="'+list['_id']+'">' + list.name + '</li>';
                });
            } else {
                alert('Error: ' + list.msg);
            }
        });       
    }       
}

$('#addList').click(function(event) {
    if (event.target.tagName=='LI') {
        selectedList=(event.target.dataset.listid);
        fillList('/lists/' + selectedList, '#addTask ul', function (task) {
            return '<li data-taskid=">' + task['_id']+'">' + '<input type="checkbox">' + task.name + '</li>';
        });
    }
});


$('#addTask').click(function(event) {
    if (event.target.tagName=='LI') {
        selectedTask=(event.target.dataset.taskid);
        console.log(selectedTask);
    }
});

})();



 



