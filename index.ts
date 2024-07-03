#! /usr/bin/evn node

import inquirer from 'inquirer';
import chalk from 'chalk';
import Choice from 'inquirer/lib/objects/choice.js';


console.log(chalk.magentaBright('\n\t=============================== ---*** W E L C O M E ***--- ===============================\n'));
console.log(chalk.bgMagentaBright('\n\t------------------------------- UNIVERSITY MANAGEMENT SYSTEM -------------------------------\n'));

class Person {
    constructor(public name: string, public age: number) {}

    getName(): string {
        return this.name;
    }
}

class Student extends Person {
    constructor(name: string, age: number, public rollNumber: string, public courses: Course[] = []) {
        super(name, age);
    }

    registerForCourse(course: Course): void {
        this.courses.push(course);
    }
}

class Instructor extends Person {
    constructor(name: string, age: number, public salary: number, public courses: Course[] = []) {
        super(name, age);
    }

    assignCourse(course: Course): void {
        this.courses.push(course);
    }
}

class Course {
    public students: Student[] = [];
    public instructor: Instructor | null = null;

    constructor(public id: string, public name: string) {}

    addStudent(student: Student): void {
        this.students.push(student);
    }

    setInstructor(instructor: Instructor): void {
        this.instructor = instructor;
    }
}

class Department {
    public courses: Course[] = [];

    constructor(public name: string) {}

    addCourse(course: Course): void {
        this.courses.push(course);
    }
}

// =========== SAMPLE DATA ===========

const coursesList = [
    new Course('C001', 'Computer Security and Networks'),
    new Course('C002', 'Cyber Security'),
    new Course('C003', 'Data Structures'),
    new Course('C004', 'Machine Learning'),
    new Course('C005', 'Operating Systems'),
    new Course('C006', 'Software Engineering'),
    new Course('C007', 'Web Development'),
];

const departments: Department[] = [
    new Department('Computer Science'),
    new Department('Information Technology')
];

const students: Student[] = [];
const instructors: Instructor[] = [];

// ======= CLI FUNCTIONS =======

async function addStudent() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter Student Name:'
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter Student Age:',
            default: 18
        },
        {
            type: 'input',
            name: 'rollNumber',
            message: 'Enter Student Roll Number:'
        },
        {
            type: 'list',
            name: 'course',
            message: 'Select Course:',
            choices: coursesList.map(c => c.name)
        },
    ]);

    const selectedCourse = coursesList.find(course => course.name === answers.course);
    if (parseInt(answers.age) < 18) {
        console.log(chalk.bgBlueBright('Student not added. Minimum age should be 18.'));
        return;
    }

    const student = new Student(answers.name, parseInt(answers.age), answers.rollNumber, selectedCourse ? [selectedCourse] : []);
    students.push(student);
    selectedCourse?.addStudent(student);
    console.log(chalk.bgMagenta('Student Added Successfully!😀'));
}

async function addInstructor() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter Instructor Name:'
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter Instructor Age:',
            default: 30
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Instructor Salary:',
            validate: function (value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        },
        {
            type: 'list',
            name: 'course',
            message: 'Select Course:',
            choices: coursesList.map(c => c.name)
        },
    ]);

    const selectedCourse = coursesList.find(course => course.name === answers.course);
    if (parseInt(answers.age) < 30) {
        console.log(chalk.bgHex('DAA520')('Instructor not added. Minimum age should be 30.'));
        return;
    }

    const instructor = new Instructor(answers.name, parseInt(answers.age), parseFloat(answers.salary), selectedCourse ? [selectedCourse] : []);
    instructors.push(instructor);
    selectedCourse?.setInstructor(instructor);
    console.log(chalk.bgHex('DAA520')('Instructor Added Successfully!😀'));
}

async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter Department Name:'
        },
        {
            type: 'checkbox',
            name: 'courses',
            message: 'Select Courses:',
            choices: coursesList.map(c => c.name)
        }
    ]);

    const department = new Department(answers.name);
    const selectedCourses = coursesList.filter(course => answers.courses.includes(course.name));
    selectedCourses.forEach(course => department.addCourse(course));
    departments.push(department);
    console.log(chalk.bgRedBright('Department Added Successfully!😀'));
}

async function listDepartments() {
    departments.forEach(department => {
        console.log(chalk.blackBright(department.name));
        department.courses.forEach(course => {
            console.log(`\t${course.name} - ${course.students.length} students`);
        });
    });
}

async function mainMenu() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Choose an Option:',
                choices: [
                    'Add Student',
                    'Add Instructor',
                    'Add Department',
                    'List Departments and Courses',
                    'Exit'
                ]
            }
        ]);

        switch (answers.option) {
            case 'Add Student':
                await addStudent();
                break;
            case 'Add Instructor':
                await addInstructor();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'List Departments and Courses':
                await listDepartments();
                break;
            case 'Exit':
                return;
        }
    }
}

// Start The CLI
mainMenu();