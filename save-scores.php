<?php

// Get the name and score from the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $score = $_POST['score'];

  // Open the text file for writing
  $file = fopen('scores.txt', 'a');

  // Write the name and score to the text file as a JSON object
  $data = ['name' => $name, 'score' => intval($score)];
  $jsonData = json_encode($data) . "\n";
  fwrite($file, $jsonData);

  // Close the text file
  fclose($file);

  // Return a success response
  header('Content-Type: application/json');
  echo json_encode(['success' => true]);
}

// Get the scores from the text file
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Open the text file for reading
  $file = fopen('https://localhost/scores.txt', 'r');

  // Read the contents of the text file into an array of JSON objects
  $scores = [];
  while (!feof($file)) {
    $line = fgets($file);
    if ($line !== false && trim($line) !== '') {
      $scoreData = json_decode($line, true);
      $scores[] = [
        '$name' => $scoreData['$name'],
        '$score' => intval($scoreData['$score'])
      ];
    }
  }

  // Close the text file
  fclose($file);

  // Sort the scores in descending order
  usort($scores, function ($a, $b) {
    return $b['score'] - $a['score'];
  });

  // Return the scores as JSON
  header('Content-Type: application/json');
  echo json_encode($scores);
}