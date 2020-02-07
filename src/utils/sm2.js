const calcGrade = value => {
  if (value > 1) {
    if (value === 2) {
      return 3;
    }
    return 5;
  }

  return 0;
};

const calcEf = (previousEf, grade) => {
  let ef = 2.5;

  if (!previousEf || grade < 3) {
    return ef;
  }

  ef = previousEf.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  if (ef < 1.3) {
    ef = 1.3;
  }

  return ef;
};

const calcInterval = (ef, repetition = 1) => Math.round(repetition * ef);

const getNextReviewIntervalString = (rating, previousEf, repetition = 1) => {
  const grade = calcGrade(rating);

  console.log(`grade: ${grade}`);
  const ef = calcEf(previousEf, grade);
  console.log(`ef: ${ef}`);

  const intervalDays = calcInterval(ef, repetition);
  console.log(`intervalDays: ${intervalDays}`);

  if (intervalDays <= 31) {
    return `${intervalDays} days`;
  }

  const intervalMonths = Math.round((intervalDays / 31) * 10) / 10;

  if (intervalMonths <= 12) {
    return `${intervalMonths} months`;
  }

  const intervalYears = Math.round((intervalMonths / 12) * 10) / 10;

  return `${intervalYears} years`;
};

export { calcGrade, calcEf, calcInterval, getNextReviewIntervalString };
