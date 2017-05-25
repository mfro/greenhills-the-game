import * as world from 'world';
import * as objects from 'world/objects';
import * as materials from 'world/materials';
import * as requirements from '../requirements';

import Vector from 'math/vector';
import Region from '../region';

import Student from 'world/entities/student';
import Teacher from 'world/entities/teacher';

import Desk from 'world/objects/desk';

class Classroom extends Region {
    private readonly _students = new Array<Student>();
    private readonly _desks = new Array<Desk>();
    private _teacher: Teacher;

    constructor(def: Region.Definition) {
        super(def);
    }

    public get hasRoom() {
        let desk = this._desks.find(d => d.owner == null);

        return Boolean(desk);
    }

    public get hasTeacher() {
        return this._teacher != null;
    }

    public addStudent(student: Student) {
        let desk = this._desks.find(d => d.owner == null);
        if (!desk)
            throw new Error('No room in class for student!');

        desk.owner = student;
        world.change();

        return desk;
    }

    public setTeacher(teacher: Teacher) {
        if (this._teacher)
            throw new Error('No room in class for teacher!');

        this._teacher = teacher;

        this.update();
        world.change();
    }

    public removeStudent(student: Student) {
        let desk = this._desks.find(d => d.owner == student);
        desk && (desk.owner = null);

        world.change();
    }

    public removeTeacher() {
        this._teacher = null;

        this.update();
        world.change();
    }

    protected update() {
        super.update();

        for (let tile of this.tiles) {
            let desk = objects.getObject(tile);
            if (desk == null || !(desk instanceof Desk))
                continue;

            if (this._desks.indexOf(desk) >= 0)
                continue;

            this._desks.push(desk);
        }
    }

    protected validate() {
        return super.validate() && this._teacher != null;
    }
}

export default Classroom;