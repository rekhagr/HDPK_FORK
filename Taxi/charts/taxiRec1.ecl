ds := DATASET([ {'English', 5},
{'History', 17},
{'Geography', 7},
{'Chemistry', 16},
{'Irish', 26},
{'Spanish', 67},
{'Bioligy', 66},
{'Physics', 46},
{'Math', 98}],
{STRING subject, INTEGER4 year});
data_example := OUTPUT(ds, NAMED('Chart2D__test'));
data_example;