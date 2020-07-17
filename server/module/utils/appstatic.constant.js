const _Constants = {
  defaultRoom: 'f3Quiz',
  game: {
    levels: {
      level1: {
        numOfQuestion: 2,
        level: 1
      },
      level2: {
        numOfQuestion: 3,
        level: 2
      },
      level3: {
        numOfQuestion: 3,
        level: 3
      },
      level4: {
        numOfQuestion: 2,
        level: 4
      }
    },
    timePerQues: 30
  },
  collections: {
    user: "users",
    room: "rooms",
    questions: "questionbanks"
  },
  questions: {
    defaultGrp: 'qbank'
  }
}

module.exports = _Constants;