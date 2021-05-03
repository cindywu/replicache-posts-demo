export default async (req, res) => {
  res.json({
    // We will discuss these two fields in later steps.
    lastMutationID: 0,
    cookie: null,
    patch: [
      {op: 'clear'},
      {
        op: 'put',
        key: 'post/ac9f617e-b34f-4fb9-9626-7b2f5a86cc00',
        value: {
          from: 'Jane',
          content: "Hey, what's for lunch?",
          order: 1,
          labels: [
            { 
              id: '80335e7f-b15a-440b-a55a-2d94815ac892',
              color: 'red',
              name: 'important'
            }
          ]
        },
      },
      {
        op: 'put',
        key: 'post/d8a08394-7b7f-47d6-ac04-f00bcac482fb',
        value: {
          from: 'Fred',
          content: 'tacos?',
          order: 2,
          labels: [
            {
              id: '6894e3b7-23f8-4b4b-ad60-53b73909fc3d',
              color: 'blue',
              name: 'snoozed'
            }
          ]
        },
      },
    ],
  });
  res.end()
}