exports.registrationEmail = ({ name, courseName }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation</title>
    <style>
        *{
            font-family:Verdana, Geneva, Tahoma, sans-serif;
        }
        .container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap:20px
        }
       .yellowBG{
        background-color: #FFD609;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 50px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 600;
       }
       .logoS{
             background-color: black;
             height: 20px;
             width: 20px;
             border-radius: 20px;
             padding: 5px;
             margin-right:8px ;
             color:#FFD609;
            display: flex;
             align-items: center;
             justify-content:center ;
       }
       .blueTxt{
        color: #1155cc;
        
       }
       .textContent{
        text-align: center;
        
       }
       .bold{
        font-weight: bold;
       }
       .footerText{
         color: gray;
       }
    </style>
</head>
<body>
    <div class="container">
        <div class="yellowBG">
            <div class="logoS">
                   S
            </div>
            <div>
                StudyNotion
            </div>
        </div>
        <div class="textContent">
            
          <span class="bold">Course Registration Confirmation</span>
          <br><br><br>
          <span>
             Dear ${name},<br><br>
            You have successfully registered for the course <span class="bold">"${courseName}"</span>we are excited to have you as a participant!
            <br><br>
            <span>Please log in to your learning dashboard to access the course materials and start your learning journey.</span>
          </span>
        </div>
        
        <div class="yellowBG blueTxt">
             Go to Dashboard
        </div>
        <div class="footerText">
         If you have any questions or need assistenace.please feel free to reach out to us at
         <a href="#">info@studynotion.com.</a>
         We are here to help
        </div>
    </div>
</body>
</html>`;
};
