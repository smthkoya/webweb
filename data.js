async function tmp() {
  let data = await fetch("./question.txt");
  data = await data.text();
  return data;
}
let test = await tmp();
let true_false = [];
let arr = test.split("\n").filter((line) => line.trim());
let questions = [];
let answers = [];
let i = 0;

function countAnswers(lines) {
  let answerCounts = [];
  let currentCount = 0;
  for (let line of lines) {
    if (line.trim().startsWith("•") || line.trim().startsWith("√")) {
      currentCount++;
    } else if (line.trim().match(/^\d+\./)) {
      if (currentCount > 0) {
        answerCounts.push(currentCount);
        currentCount = 0;
      }
    }
  }
  if (currentCount > 0) {
    answerCounts.push(currentCount);
  }
  return answerCounts;
}

// Extract questions
while (i < arr.length) {
  let line = arr[i];
  if (line.match(/^\d+\./)) {
    let question = line;
    i++;
    while (
      i < arr.length &&
      !arr[i].match(/^\d+\./) &&
      !arr[i].includes("√") &&
      !arr[i].includes("•")
    ) {
      question += " " + arr[i];
      i++;
    }
    questions.push(question);
  } else {
    i++;
  }
}

// Extract answers and true/false
i = 0;
while (i < arr.length) {
  let line = arr[i];
  if (line.includes("√") || line.includes("•")) {
    true_false.push(line.includes("√"));
    let answer = line;
    i++;
    while (
      i < arr.length &&
      !arr[i].match(/^\d+\./) &&
      !arr[i].includes("√") &&
      !arr[i].includes("•")
    ) {
      answer += " " + arr[i];
      i++;
    }
    if (line.includes("•")) {
      answers.push(line.slice(line.indexOf("•") + 1));
    }
    if (line.includes("√")) {
      answers.push(line.slice(line.indexOf("√") + 1));
    }

    // answers.push(answer);
  } else {
    i++;
  }
}

let count_answers = countAnswers(arr);
let cumulative_counts = Array.from(
  { length: count_answers.length + 1 },
  (_, i) => count_answers.slice(0, i).reduce((acc, val) => acc + val, 0)
);

let result = Array.from({ length: count_answers.length }, (_, i) =>
  true_false.slice(cumulative_counts[i], cumulative_counts[i + 1])
);
answers = Array.from({ length: count_answers.length }, (_, i) =>
  answers.slice(cumulative_counts[i], cumulative_counts[i + 1])
);

let res = [];

for (let i = 0; i < questions.length; i++) {
  let lastAnswer = answers[i][answers[i].length - 1];
  let nextQuestionNumber = i + 2 + ".";
  let index = lastAnswer.indexOf(nextQuestionNumber);
  if (index !== -1) {
    lastAnswer = lastAnswer.slice(0, index).trim();
  }
  answers[i][answers[i].length - 1] = lastAnswer;
  res.push(
    [questions[i].slice(questions[i].indexOf(".") + 1).trim()].concat(
      answers[i]
    )
  );
}

async function tmp1() {
  try {
    let response = await fetch("./output_images");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let files = await response.json(); // Assuming JSON response containing file names
    return files;
  } catch (error) {
    return []; // Return an empty array as a fallback
  }
}
let files = await tmp1();
let countt = 0;
let image_question = [];
async function main(res) {
  // Sorting files based on numeric parts
  files = Object.keys(files).sort(
    (a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0])
  );

  for (let i = 0; i < res.length; i++) {
    if (!/[a-zA-Zа-яА-Я]/.test(res[i]) && !/[0-9]/.test(res[i])) {
      res[i] = `output_imagess/${countt++}.jpg`;
    }
  }
  image_question.push(res);
}
console.log(image_question);

for (var j = 0; j < res.length; j++) {
  main(res[j]);
}
export { image_question, result };
