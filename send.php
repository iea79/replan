<?php
if ((isset($_POST['tel']) && $_POST['tel'] != "")) { //Проверка отправилось ли наше поля name и не пустые ли они
    $to = 'busforward@gmail.com, vorobyev_sasha@icloud.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
    $subject = ''.$_POST['subject'].'';
    if ((isset($_POST['question']) && $_POST['question'] != "")) {

	    $message = '
	                <html>
	                    <head>
	                        <title>' . $_POST['subject'] . '</title>
	                    </head>
	                    <body>
	                        <p>Телефон: ' . $_POST['tel'] . '</p>                        
	                        <p>Сообщение: ' . $_POST['question'] . '</p>                        
	                    </body>
	                </html>'; 
    } else {

	    $message = '
	                <html>
	                    <head>
	                        <title>' . $_POST['subject'] . '</title>
	                    </head>
	                    <body>
	                        <p>Имя: ' . $_POST['email'] . '</p>
	                        <p>Телефон: ' . $_POST['tel'] . '</p>                        
	                    </body>
	                </html>'; 
    }
    $headers = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: Отправитель <busforward@gmail.com>\r\n"; //Наименование и почта отправителя
    if (mail($to, $subject, $message, $headers)) {
        echo 'success';
    } else {
        echo 'error';
    }
}?>