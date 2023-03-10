import {CreepSpawning} from "@/creep/creepSpawing";

export abstract class WorkStation {


    id: string;
    roomName: string;
    departmentName: DepartmentName;

    creepList: CreepList;
    creepConfig:  CreepSpawnConfig;

    protected constructor(roomName: string,  stationType: StationType) {
        this.roomName = roomName;
        this.id = stationType;
    }

    protected abstract executeOrder(): void;
    protected abstract maintenance(): void;

    protected abstract getMemObject();


    public run() {
        this.executeOrder();
        this.maintenance();
    }

    /***************** UTILS *****************/
    protected getRandomName(): string {
        return this.id + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    protected sendCreepSpawnTask (creepName: string, spawnConfig: CreepSpawnConfig) {
        const creepSpawning = new CreepSpawning(this.roomName);
        creepSpawning.addSpawnTask(creepName, spawnConfig);
    }

    protected renewCreeps(): void {
        let mem = this.getMemObject();
        const creepList: CreepList = mem['creepList'];
        const creepConfig: CreepSpawnConfig = mem['creepConfig'];
        for (let creepName in creepList) {
            if (creepList[creepName].deadTick != null)
                if (creepList[creepName].deadTick <= Game.time) {
                    this.sendCreepSpawnTask(creepName, creepConfig);
                    creepList[creepName].deadTick = null;
                }
        }
    }

}