$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.fullname);
    });

   
});

app.get('/pages/photos/:id', function (req, res){
    //show photos with comments
    //1. photo with id :id
    // 2. all comments associated with id :id
    //likes associated with photo
    var photoId=req.params.id;
    var photoData = []
    Photos.findOne({
        where:{id: photoId}, 
        attributes: ['id','userId','filename', 'caption', 'createdAt']
              }).then(function (rowPhotos){
                 Comments.findAll({
                        where: {photoId:photoId}
                 }).then(function (rowComments){
                    Likes.findAll({
                        where:  {photoId: photoId}
                    }).then(function (rowLikes){
                        Users.findAll().then(function (commentUser){
                var data= {
                photoData: rowPhotos,
                commentData: rowComments,
                likesData: rowLikes,
                userData:commentUser
                }
               console.log(data);
               res.render('views', {data:data})
    
                        })
    
                    })
            })  
    })})



    user.findOne({where : {email: 'johndoe@example.com'}}).then(function(user) {
        // Send user to view
      });