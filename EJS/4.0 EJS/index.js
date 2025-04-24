import express from 'express';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

const adviceList = [
    "Sunday: Rest and recharge 🌿",
    "Monday: Start the new week with a clear goal! 💪",
    "Tuesday: Keep going, success is coming 🚀",
    "Wednesday: Don't forget to take care of yourself 🧘‍♂️",
    "Thursday: New opportunities may come unexpectedly, be ready! 🎯",
    "Friday: Finish your work and prepare for the weekend 🎉",
    "Saturday: Enjoy time with family and friends ❤️"
];

app.get('/', (req, res) => {
    const today = new Date().getDay();   
    const advice = adviceList[today];
    res.render('index', { advice }); 
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});