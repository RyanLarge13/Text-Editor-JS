# Text Editor JS

Welcome! I want to start by giving a brief intro to this project and why I chose to make it.
I realized as my journey through learning how to write software progressed that I was getting
quite tired of hearing advice to NOT re-invent the wheel.

I grew tired of this advice because simply most libraries do not provide the customization and
utility that I desired. This commonly reoccurring issue was most prevalent in web based text editors.

Most rich text editor libraries do a great job at making out lives easier even in the most
complicated and feature heavy utility apps. But this sometimes comes with hours upon hours of
reading through documentation, sweating through the errors and incompatibilities, deprecation warnings
etc... I figured there is nothing wrong with reinventing the wheel for two big reasons.

1. Learning
2. Customization

No matter how many struggles I might run into throughout this application I know I am gaining experience and
knowledge as a software engineer far more valuable and important that library specific knowledge

I also know that if there is some feature I would like to add or a look I would like to change, I have the power and the
tools to do so with ease and a solid understanding behind my own code base. Also it is free. Although most libraries are free to
use anyway even the pay to use libraries have a free version, but still.

Anyway. Thank you for reading. let's dive into this project

## Overview

Text editor js is a text editor application for desktop built on the web and written in JavaScript.
This text editor leverages the power of gap buffers to render/edit/format text. No text inputs
or text areas are used in this application. Just a fancy tool bar and a plain div to represent the paper.

Logic is separated into 3 main classes

1. Toolbar class
2. Editor class
3. Buffer class

each of these classes modulates and separates concern of the main processes of the application

### Toolbar Class

The toolbar class handles very little functionality covering UI more than anything such as
updating the active state of the button when a specific style or format is selected

### Editor Class

The editor class is a mediatory class that helps the main script communicate with specific gap buffers, handles dom manipulation,
style and formatting updates to the text

### Buffer class

The buffer class is the heart of performance in this application. It handles all of the logic for manipulating the text being rendered by inserting
and removing text characters and positioning the cursor within the text. Multiple buffers are assigned within the application as the user types depending
on the formatting and styling they create. The application tries to balance the number of gap buffers for manipulating and rendering text within the application
but also not allowing a single buffer to get too large as to mitigate against costly array operations especially when the buffer needs to grow in size and copy its elements
