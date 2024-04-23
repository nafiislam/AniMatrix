const bcrypt=require('bcrypt');
var bal='';
bcrypt.hash('10', 10, function(err, hash) {
    bal=hash;
    bcrypt.compare('10',bal, function(err, result) {
        console.log(result)
        bcrypt.compare('11', bal, function(err, result) {
            console.log(result)
        });
    });
});
