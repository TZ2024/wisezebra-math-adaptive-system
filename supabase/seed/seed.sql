insert into admin_users (email, full_name, role)
values ('admin@wisezebra.com', 'WiseZebra Admin', 'admin')
on conflict (email) do nothing;

insert into questions (external_key, prompt, answer, teacher_explanation, common_errors, hints, wz_level, domain, skill, michigan_standard, kumon_reference, difficulty, status)
values
('q-wz7-place-value-1', 'What is the value of the digit 5 in 3,582?', '500', 'The digit 5 is in the hundreds place, so its value is 500.', array['Choosing 50 instead of 500'], array['Read the place from right to left: ones, tens, hundreds, thousands.'], 'WZ7', 'Number and Place Value', 'place value to thousands', '3.NBT.A.1', 'A 170', 3, 'approved'),
('q-wz8-multiplication-1', 'Solve 24 × 6.', '144', '24 × 6 = (20 × 6) + (4 × 6) = 120 + 24 = 144.', array['Forgetting to regroup'], array['Break 24 into 20 and 4.'], 'WZ8', 'Operations and Fluency', 'multi-digit multiplication', '4.NBT.B.5', 'D 90', 4, 'approved'),
('q-wz9-fraction-1', 'What is 3/4 + 1/8?', '7/8', '3/4 = 6/8, and 6/8 + 1/8 = 7/8.', array['Adding tops and bottoms directly'], array['Change 3/4 into eighths first.'], 'WZ9', 'Fractions, Decimals, Measurement, and Ratio', 'add fractions with unlike denominators', '5.NF.A.1', 'E 120', 5, 'approved'),
('q-wz10-geometry-1', 'A rectangle has length 9 and width 4. What is its area?', '36', 'Area of a rectangle is length × width, so 9 × 4 = 36.', array['Adding instead of multiplying'], array['Area means rows times columns.'], 'WZ10', 'Geometry, Data, and Word Problems', 'area of rectangles', '4.MD.A.3', 'C 160', 3, 'approved'),
('q-wz13-negative-1', 'Which number is greater, -3 or -7?', '-3', 'On a number line, -3 is to the right of -7, so -3 is greater.', array['Thinking -7 is greater because 7 is bigger'], array['Use a number line.'], 'WZ13', 'Signed Numbers and Prealgebra Bridge', 'compare signed numbers', '6.NS.C.7', 'J 20', 4, 'approved'),
('q-wz14-ratio-1', 'If the ratio of red to blue marbles is 2:3 and there are 12 blue marbles, how many red marbles are there?', '8', 'If 3 parts equal 12, then each part is 4. Red is 2 parts, so 2 × 4 = 8.', array['Adding 2 and 3 then dividing incorrectly'], array['3 parts = 12, so 1 part = 4.'], 'WZ14', 'Signed Numbers and Prealgebra Bridge', 'ratios and rates', '6.RP.A.3', 'J 80', 6, 'approved')
on conflict (external_key) do nothing;
