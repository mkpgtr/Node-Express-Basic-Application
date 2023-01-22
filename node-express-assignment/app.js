const express = require('express');



const app = express();


const storage = require('node-persist');


// ! initialize node-persist
storage.init();

app.use(express.json())




// ! populate students via postman.

// ! browser sends get request so /createStudent will not be hit because /createStudent has POST as its HTTP verb.

app.post('/createStudent',async(req,res)=>{

    // ! all data coming from postman will be in req.body as an array of objects.



    const students = req.body;

    // ! we store this array in our storage
    
    
    await storage.setItem('students',students);
    
    
    res.send(req.body);
})

// ! :id will be dynamically passed along with our url

app.get('/student/:id',async (req,res)=>{

    const id= parseInt(req.params.id);

    console.log(req.params)
    const allStudents = await storage.getItem('students')



    let html = `<h1>Student Detail</h1>`
    const student = allStudents.filter(student=>id===student.id);

    console.log(student);

    student.forEach((studentObject)=>{
        html+=`<h2>id:${studentObject.id}</h2>`
        html+=`<h2>name:${studentObject.name}</h2>`
        html+=`<h2>gpa:${studentObject.gpa}</h2>`
    })


    res.send(html)
})

// ! get the all students by visiting localhost:5000/allStudents
app.get('/allStudents',async(req,res)=>{

    // storage.init();

    let html = `<h1> All Student Data ! </h1>`
    
    const allStudents = await storage.getItem('students')

    allStudents.forEach((student)=>{
        html+= `
        
        <h2>id:${student.id}</h2>
        <h2>name:${student.name}</h2>
        <h2>gpa:${student.gpa}</h2>
        <hr>
        
        `
    })
    
    res.send(html);
})
// ! get the topper student by visiting localhost:5000/topper
app.get('/topper',async(req,res)=>{
    const allStudents = await storage.getItem('students')


    // ! layout the GPAs in a separate array [4.5,4.7,4]
    const allGPAs = allStudents.map(a=>a.gpa);

    // ! set the GPA to any index. let's say we set it to first index.

    let highest = allGPAs[0];

    // ! common algorithm to find the maximum value
    for (var i = 0; i < allGPAs.length; i++) {
        if (highest < allGPAs[i] ) {
            highest = allGPAs[i];
        }
    }

    console.log(highest);

    const topper = allStudents.filter((student)=>{
        return student.gpa === highest ? student : null
    })

    let html = `<h1> Student Detail </h1>`
    topper.forEach((topperObject)=>{
        html+=`
        <h2>id:${topperObject.id}</h2>
        <h2>name:${topperObject.name}</h2>
        <h2>gpa:${topperObject.gpa}</h2>
        
        `
    })



    res.send(html);
})













app.listen(5000, () => {
  console.log('server is listening on port 5000....')
})

