
let form = document.getElementById('form_add_weight');
ul = document.getElementsByTagName('ul')[0];
function init () //инициализируем данные из localStarage
{
  window.onload = LoadNotesFromLocalStorage();
  form.addEventListener('submit', function(event){
	event.preventDefault(); //отменяет поведение браузера по умолчанию
	AddNewNote(); 
  
}) ;
}

init();

//Добавление новой записи в трекере (отображение и сохранение в LS)
function AddNewNote() {
  let li = document.createElement('li'),
      wight = document.querySelector(".wightValue").value,
      date = document.querySelector(".dateValue").value,
      user = document.querySelector(".userValue").value,
		  span = document.createElement('span');

	    span.innerHTML = ' X ';
      li.innerText= `Дата: ${date} Пользователь: ${user} Вес: ${wight} `;
      li.append(span);
      span.addEventListener('click', handleDel);
      ul.append(li);	

      SaveInLocalStorage(date,user,wight)
}

function handleDel(event) {
  //удаление с разметки
  event.target.parentElement.remove();
  //удаление из LS
  let temp = event.target.parentElement.innerText;
  let r = temp.split(' ');
  let search = Array();
  search.push(r[1]);
  search.push(r[3]);
  search.push(r[5]);
  let LS = GetInLocalStorage();  
  LS.forEach(function(elem, index)
    {
      if (elem.toString() === search.toString())
        {
          LS.splice(index,1);
          localStorage.setItem('tableSave', JSON.stringify(LS));
        }
  })
}

function SaveInLocalStorage(date, user, wight)
{
  //вытаскиваем все что уже есть в LS
  let li = GetInLocalStorage();
  var saveItem = [date, user, wight];
  //если это первое добавление
  if( li == null)
  {
    let tableSave = Array();
    tableSave.push(saveItem);
    localStorage.setItem('tableSave', JSON.stringify(tableSave))
  }
  //если уже есть данные, то добавляем в конец новую запись
  else{
    li.push(saveItem);
    localStorage.setItem('tableSave', JSON.stringify(li))
  }
}

function GetInLocalStorage(){
  let LS =localStorage.getItem('tableSave');
  return(JSON.parse(LS));
}

function LoadNotesFromLocalStorage(){
  if (ul.firstChild != null)
  {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  }
  let temp = GetInLocalStorage();

  if(temp != null)
  {
    temp.forEach(function(elem){
      let li = document.createElement('li'),
      span = document.createElement('span');
      span.innerHTML = ' X ';
      li.innerText= `Дата: ${elem[0]} Пользователь: ${elem[1]} Вес: ${elem[2]} `;
      li.append(span);
      span.addEventListener('click', handleDel);
      ul.append(li);});
  }
}

  let formSort = document.getElementById("SortingForm");
  formSort.addEventListener('submit', function(event)
    {
      event.preventDefault();
      let array=DateSort();
      let displayarray = Filter(array);
      Display(displayarray);
    
    })

  function DateSort(){
    let array = GetInLocalStorage();
    if (formSort.sort.value == 'min') //соортировка по убыванию даты
      {
        array.sort((a, b) => a[0] < b[0] ? 1 : -1);
      }
      if (formSort.sort.value == 'max') //соортировка по возрастанию даты
      {
        array.sort((a, b) => a[0] > b[0] ? 1 : -1);
      }
      return (array);
  }

  function Filter(array){
    newarray = Array();
    username = document.querySelector(".userName").value;
    if (username.toString() != "")
      {
        array.forEach(function(elem){
          if (elem[1].toString() == username.toString())
            {
              newarray.push(elem);
            }
          })
        PaintDiagram(newarray);
        return (newarray);
      }
    return (array);
  }

  function Display(array){
     //отображениие на странице
     ul.replaceChildren();
     array.forEach(function(elem){
       let li = document.createElement('li'),
       span = document.createElement('span');
       span.innerHTML = ' X ';
       li.innerText= `Дата: ${elem[0]} Пользователь: ${elem[1]} Вес: ${elem[2]} `;
       li.append(span);
       span.addEventListener('click', handleDel);
       ul.append(li);	
     })
  }

  function PaintDiagram(array){
    let canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = 1000;
    canvas.height = 600;

    let date = array.map(item => item[0]);
    let width = array.map(item => item[2]);
  
    let maxWidth= Math.max(...width); //вытягиваем максимальный вес 
 
    ctx.moveTo(50, 50); //передвигаемся в точку 50,50
    ctx.lineTo(50, 500); // вертикальная линия
    ctx.lineTo(950, 500); //  горисонтальная линия 
    ctx.stroke(); //обведём путь 
  
    let barWidth = 50; //ширина столбца
    let spacing_bar = 20; // расстояние между столбцами
    let startX = 70; // отступ столбца от вертикальной линии 
    let startY = 500; 

    ctx.font = '12px Arial';
    for (let i = 0; i < width.length; i++) {
      let barHeight = (width[i] / maxWidth) * 450;
      ctx.fillRect(startX + (barWidth + spacing_bar) * i, startY - barHeight, barWidth, barHeight);
      ctx.fillText(width[i], startX + (barWidth + spacing_bar) * i, startY - barHeight - 5);
      ctx.fillText(date[i], startX + (barWidth + spacing_bar) * i, startY + 20);
    }
  }
