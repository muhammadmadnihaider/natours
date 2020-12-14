const fs = require('fs');
const express = require('express');
const { get } = require('http');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const getAlltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (id > tours.length || id < 0) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ..... >',
    },
  });
};
const deleteTour = (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (id > tours.length || id < 0) {
    res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// app.get('/api/v1/tours', getAlltours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// the below one code does the same thing as above one but below one is nice readible
// we specify all the action for specific routes
app.route('/api/v1/tours').get(getAlltours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
const port = 3000;
app.listen(port, () => {
  console.log(`server is listening on the port ${port}`);
});
