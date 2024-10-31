import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import Task, { TaskResponse } from '../tasks/task-types';
import { UserResponse } from '../user/user-type';
import { SimpleLinearRegression } from "ml-regression-simple-linear";
import sprintService from '../sprints/sprint-service';
import ProjectModel from '../projects/project-model';
import sprintModel from '../sprints/sprint-model';
import phaseModel from '../phase/phase-model';
  
  interface Statistic {
    day?: number;
    month: number;
    year: number;
    amount: number;
  }

// export default new class AnalyticsService {
//     getMaxDaysInMonth(year, month) {
//         // Use the next month's 0th day to get the last day of the current month
//         const lastDayOfMonth = new Date(year, month + 1, 0);
//         return lastDayOfMonth.getDate();
//     }

//     async fetchTasks (userId: string | undefined, projectId: string) {
//         const tasks: any[] = await taskService.getAllTasks(projectId);
//         const filteredTasks = (userId) ? tasks.filter((task: TaskResponse) => task.executors.find((executor: UserResponse) => executor._id.toString() === userId)) : tasks;
//         return filteredTasks;
//     }

//     mapTasks(tasks: TaskResponse[], startDate: Date, endDate: Date, condition: (task: TaskResponse, month: number, dayOrYear: number) => boolean, daily: boolean) {
//         const result = [];
//         if(daily) {
//             const endMonth = (endDate.getMonth() === 0) ? 12 : endDate.getMonth()
//             for(let month = startDate.getMonth(); month <= endMonth; month++) {
//                 for(let day = (month === startDate.getMonth()) ? startDate.getDate() : 1; day <= ((month === endMonth) ? endDate.getDate() : this.getMaxDaysInMonth(endDate.getFullYear(), month)); day++) {
//                     let counter = 0;
//                     tasks.map((task: TaskResponse) => {
//                         if(condition(task, month, day)) { counter++ }
//                     })
//                     result.push({month, day, amount: counter});
//                 }
//             }
//         }
//         else
//             for(let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
//                 for(let month = ((year === startDate.getFullYear()) ? startDate.getMonth() : 0); month <= ((year === endDate.getFullYear()) ? endDate.getMonth() : 12); month++) {
//                     let counter = 0;
//                     tasks.map((task: TaskResponse) => {
//                         const conditionResult = condition(task, month, year);
//                         if(conditionResult) counter++
//                     })
//                     result.push({month, year, amount: counter});
//                 }
//             }
//         return result
//     }

//     checkedTaskCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
//         if(daily) return task.checkedDate && task.checkedDate.getDate() === dayOrYear && task.checkedDate.getMonth() === month
//         else return task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getFullYear() === dayOrYear;
//     }

//     checkedTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
//         if(daily) return task.checkedDate && task.checkedDate <= new Date(task.checkedDate.getFullYear(), month, dayOrYear, 23);
//         else return task.checkedDate && task.checkedDate <= new Date(dayOrYear,month,1);
//     }

//     createdTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
//         if(daily) return task.created && task.created <= new Date(task.created.getFullYear(), month, dayOrYear, 23, 59);
//         else return task.created && task.created <= new Date(dayOrYear,month,this.getMaxDaysInMonth(dayOrYear, month));
//     }

//     // async checkedTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
//     //     const tasks = await this.fetchTasks(userId, projectId);
//     //     const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskCondition(task, month, dayOrYear, daily), daily);
//     //     return result;
//     // }

//     // async createdTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
//     //     const tasks = await this.fetchTasks(userId, projectId);
//     //     const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskTraceCondition(task, month, dayOrYear, daily), daily);
//     //     return result;
//     // }
 
//     // async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
//     //     const tasks = await this.fetchTasks(userId, projectId);
//     //     const allTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskTraceCondition(task, month, dayOrYear, daily), daily);
//     //     const doneTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskTraceCondition(task, month, dayOrYear, daily), daily);
//     //     if(daily) {
//     //         const result = allTasks.map((task: {month: number, day: number, amount: number}, index: number) => doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount = doneTasks[index].amount / task.amount * 100 : 0)
//     //     } else {
//     //         const result = allTasks.map((task: {month: number, year: number, amount: number}, index: number) => doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount / task.amount * 100 : 0)
//     //     }
//     //     return doneTasks;
//     // }

//     

    
      
//     // Helper to generate a date range sequence
// generateDateRange(
//     startDate: Date,
//     endDate: Date,
//     isDaily: boolean
//   ): { year: number; month: number; day?: number }[] {
//     const dates: { year: number; month: number; day?: number }[] = [];
//     let currentDate = new Date(startDate);
  
//     while (currentDate <= endDate) {
//       const year = currentDate.getFullYear();
//       const month = currentDate.getMonth() + 1; // Adjust month to be 1-based
  
//       if (isDaily) {
//         const day = currentDate.getDate();
//         dates.push({ year, month, day });
//         currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
//       } else {
//         dates.push({ year, month });
//         currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
//         currentDate.setDate(1); // Reset to the first day of the new month
//       }
//     }
//     return dates;
//   }
  
//   async createdTaskAmount(
//     projectId: string,
//     startDate: Date,
//     endDate: Date,
//     isDaily: boolean,
//     userId: string | null = null
//   ): Promise<Statistic[]> {
//     const convertedProjectId = new mongoose.Types.ObjectId(projectId);
  
//     const getAllProjectTasks = async (): Promise<Task[]> => {
//       const generalTasks: Task[] = await TaskModel.find({
//         projectId: convertedProjectId,
//         created: { $gte: startDate, $lte: endDate }
//       });
  
//       const backlogs = await backlogModel.find({ projectId: convertedProjectId });
//       const sprintTasks: Task[] = [];
//       const backlogTasks: Task[] = [];
//       const phaseTasks: Task[] = [];
  
//       for (const backlog of backlogs) {
//         const sprints = await sprintModel.find({ backlogId: backlog._id });
  
//         for (const sprint of sprints) {
//           const tasksForSprint: Task[] = await TaskModel.find({
//             sprintId: sprint._id,
//             created: { $gte: startDate, $lte: endDate }
//           });
//           sprintTasks.push(...tasksForSprint);
//         }
  
//         const tasksForBacklog: Task[] = await TaskModel.find({
//           backlogId: backlog._id,
//           sprintId: null,
//           created: { $gte: startDate, $lte: endDate }
//         });
//         backlogTasks.push(...tasksForBacklog);
//       }
  
//       const phases = await phaseModel.find({ projectId: convertedProjectId });
//       for (const phase of phases) {
//         const tasksForPhase: Task[] = await TaskModel.find({
//           phaseId: phase._id,
//           created: { $gte: startDate, $lte: endDate }
//         });
//         phaseTasks.push(...tasksForPhase);
//       }
  
//       return [...generalTasks, ...sprintTasks, ...backlogTasks, ...phaseTasks];
//     };
  
//     const allTasks: Task[] = await getAllProjectTasks();
  
//     // Filter tasks by userId if provided
//     const filteredTasks = userId
//       ? allTasks.filter(task =>
//           task.executors.some(executor =>
//             executor.equals(new mongoose.Types.ObjectId(userId))
//           )
//         )
//       : allTasks;
  
//     // Create a map to hold cumulative statistics
//     const statsMap: { [key: string]: number } = {};
  
//     // Populate the stats map with counts of created tasks
//     filteredTasks.forEach(task => {
//       const date = task.created;
//       const key = isDaily
//         ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//         : `${date.getFullYear()}-${date.getMonth() + 1}`;
  
//       if (!statsMap[key]) {
//         statsMap[key] = 0;
//       }
//       statsMap[key]++;
//     });
  
//     // Generate the full date range to ensure every month is represented
//     const fullRange = this.generateDateRange(startDate, endDate, isDaily);
  
//     // Create an array for cumulative statistics
//     const cumulativeStatistics: Statistic[] = [];
//     let cumulativeAmount = 0;
  
//     fullRange.forEach(({ year, month, day }) => {
//       const key = isDaily
//         ? `${year}-${month}-${day}`
//         : `${year}-${month}`;
  
//       // Update cumulative amount
//       cumulativeAmount += statsMap[key] || 0;
  
//       // Push the cumulative statistic for the month
//       cumulativeStatistics.push({
//         year,
//         month,
//         day,
//         amount: cumulativeAmount
//       });
//     });
  
//     return cumulativeStatistics;
//   }

//     async checkedTaskAmount(
//         projectId: string,
//         startDate: Date,
//         endDate: Date,
//         isDaily: boolean,
//         userId: string | null = null
//       ): Promise<Statistic[]> {
//         const convertedProjectId = new mongoose.Types.ObjectId(projectId);
      
//         // Fetch all "done" tasks within the date range
//         const getAllDoneTasks = async (): Promise<Task[]> => {
//           const generalTasks: Task[] = await TaskModel.find({
//             projectId: convertedProjectId,
//             status: 'done',
//             created: { $gte: startDate, $lte: endDate }
//           });
      
//           const backlogs = await backlogModel.find({ projectId: convertedProjectId });
//           const sprintTasks: Task[] = [];
//           const backlogTasks: Task[] = [];
//           const phaseTasks: Task[] = [];
      
//           for (const backlog of backlogs) {
//             const sprints = await sprintModel.find({ backlogId: backlog._id });
      
//             for (const sprint of sprints) {
//               const tasksForSprint: Task[] = await TaskModel.find({
//                 sprintId: sprint._id,
//                 status: 'done',
//                 created: { $gte: startDate, $lte: endDate }
//               });
//               sprintTasks.push(...tasksForSprint);
//             }
      
//             const tasksForBacklog: Task[] = await TaskModel.find({
//               backlogId: backlog._id,
//               sprintId: null,
//               status: 'done',
//               created: { $gte: startDate, $lte: endDate }
//             });
//             backlogTasks.push(...tasksForBacklog);
//           }
      
//           const phases = await phaseModel.find({ projectId: convertedProjectId });
//           for (const phase of phases) {
//             const tasksForPhase: Task[] = await TaskModel.find({
//               phaseId: phase._id,
//               status: 'done',
//               created: { $gte: startDate, $lte: endDate }
//             });
//             phaseTasks.push(...tasksForPhase);
//           }
      
//           return [...generalTasks, ...sprintTasks, ...backlogTasks, ...phaseTasks];
//         };
      
//         const allTasks: Task[] = await getAllDoneTasks();
      
//         const filteredTasks = userId
//           ? allTasks.filter(task =>
//               task.executors.some(executor =>
//                 executor.equals(new mongoose.Types.ObjectId(userId))
//               )
//             )
//           : allTasks;
      
//         const statsMap: { [key: string]: number } = {};
      
//         filteredTasks.forEach(task => {
//           const date = task.created;
//           const key = isDaily
//             ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//             : `${date.getFullYear()}-${date.getMonth() + 1}`;
      
//           if (!statsMap[key]) {
//             statsMap[key] = 0;
//           }
//           statsMap[key]++;
//         });
      
//         // Generate the full date range with default values
//         const fullRange = this.generateDateRange(startDate, endDate, isDaily);
      
//         const statistics: Statistic[] = fullRange.map(({ year, month, day }) => {
//           const key = isDaily
//             ? `${year}-${month}-${day}`
//             : `${year}-${month}`;
      
//           return {
//             year,
//             month,
//             day,
//             amount: statsMap[key] || 0
//           };
//         });
      
//         return statistics;
//       }

//       async taskRatio(
//         projectId: string,
//         startDate: Date,
//         endDate: Date,
//         isDaily: boolean,
//         userId: string | null = null
//       ): Promise<Statistic[]> {
//         const convertedProjectId = new mongoose.Types.ObjectId(projectId);
      
//         const getAllProjectTasks = async (): Promise<Task[]> => {
//             const generalTasks: Task[] = await TaskModel.find({
//               projectId: convertedProjectId,
//               created: { $gte: startDate, $lte: endDate }
//             });
          
//             const backlogs = await backlogModel.find({ projectId: convertedProjectId });
//             const sprintTasks: Task[] = [];
//             const backlogTasks: Task[] = [];
//             const phaseTasks: Task[] = [];
          
//             for (const backlog of backlogs) {
//               // Fetch tasks linked to sprints associated with the backlog
//               const sprints = await sprintModel.find({ backlogId: backlog._id });
//               for (const sprint of sprints) {
//                 const tasksForSprint: Task[] = await TaskModel.find({
//                   sprintId: sprint._id,
//                   created: { $gte: startDate, $lte: endDate }
//                 });
//                 sprintTasks.push(...tasksForSprint);
//               }
          
//               // Fetch tasks that are part of the backlog but not linked to any sprint
//               const tasksForBacklog: Task[] = await TaskModel.find({
//                 backlogId: backlog._id,
//                 sprintId: null,
//                 created: { $gte: startDate, $lte: endDate }
//               });
//               backlogTasks.push(...tasksForBacklog);
//             }
          
//             // Fetch tasks linked to project phases
//             const phases = await phaseModel.find({ projectId: convertedProjectId });
//             for (const phase of phases) {
//               const tasksForPhase: Task[] = await TaskModel.find({
//                 phaseId: phase._id,
//                 created: { $gte: startDate, $lte: endDate }
//               });
//               phaseTasks.push(...tasksForPhase);
//             }
          
//             // Combine all tasks retrieved
//             return [...generalTasks, ...sprintTasks, ...backlogTasks, ...phaseTasks];
//           };
      
//         const allTasks: Task[] = await getAllProjectTasks();
      
//         const filteredTasks = userId
//           ? allTasks.filter(task =>
//               task.executors.some(executor =>
//                 executor.equals(new mongoose.Types.ObjectId(userId))
//               )
//             )
//           : allTasks;
      
//         const statsMap: { [key: string]: { done: number; total: number } } = {};
      
//         // Accumulate counts of done and total tasks
//         filteredTasks.forEach(task => {
//           const date = task.created;
//           const key = isDaily
//             ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//             : `${date.getFullYear()}-${date.getMonth() + 1}`;
      
//           if (!statsMap[key]) {
//             statsMap[key] = { done: 0, total: 0 };
//           }
          
//           statsMap[key].total++;
//           if (task.status === "done") {
//             statsMap[key].done++;
//           }
//         });
      
//         const fullRange = this.generateDateRange(startDate, endDate, isDaily);
//         const cumulativeStatistics: Statistic[] = [];
        
//         let cumulativeDone = 0;
//         let cumulativeTotal = 0;
      
//         fullRange.forEach(({ year, month, day }) => {
//           const key = isDaily
//             ? `${year}-${month}-${day}`
//             : `${year}-${month}`;
      
//           const { done, total } = statsMap[key] || { done: 0, total: 0 };
//           cumulativeDone += done;
//           cumulativeTotal += total;
      
//           const ratio = cumulativeTotal > 0 ? (cumulativeDone / cumulativeTotal) * 100 : 0; // Calculate cumulative ratio
//           cumulativeStatistics.push({
//             year,
//             month,
//             day,
//             amount: parseFloat(ratio.toFixed(2)) // Store the ratio rounded to two decimal places
//           });
//         });
      
//         return cumulativeStatistics;
//       }
// }

export default new class AnalyticsService {
    // Helper to collect all tasks
    private async getFilteredTasks(
      projectId: string,
      startDate: Date,
      endDate: Date,
      userId: string | null = null
    ): Promise<Task[]> {
      const convertedProjectId = new mongoose.Types.ObjectId(projectId);
  
      const projectTasks: Task[] = await TaskModel.find({
        projectId: convertedProjectId,
        created: { $gte: startDate, $lte: endDate },
      });
  
      const backlogs = await backlogModel.find({ projectId: convertedProjectId });
      const backlogTasks: Task[] = await this.getTasksFromBacklogs(backlogs, startDate, endDate);
  
      const phases = await phaseModel.find({ projectId: convertedProjectId });
      const phaseTasks: Task[] = await this.getTasksFromPhases(phases, startDate, endDate);
  
      const allTasks: Task[] = [...projectTasks, ...backlogTasks, ...phaseTasks];
  
      return userId
        ? allTasks.filter(task =>
            task.executors.some(executor =>
              executor.equals(new mongoose.Types.ObjectId(userId))
            )
          )
        : allTasks;
    }
  
    // Helper to collect tasks from backlogs
    private async getTasksFromBacklogs(
      backlogs: any[],
      startDate: Date,
      endDate: Date
    ): Promise<Task[]> {
      const allBacklogTasks: Task[] = [];
  
      for (const backlog of backlogs) {
        const sprints = await sprintModel.find({ backlogId: backlog._id });
  
        for (const sprint of sprints) {
          const sprintTasks: Task[] = await TaskModel.find({
            sprintId: sprint._id,
            created: { $gte: startDate, $lte: endDate },
          });
          allBacklogTasks.push(...sprintTasks);
        }
  
        const directBacklogTasks: Task[] = await TaskModel.find({
          backlogId: backlog._id,
          sprintId: null,
          created: { $gte: startDate, $lte: endDate },
        });
        allBacklogTasks.push(...directBacklogTasks);
      }
      return allBacklogTasks;
    }
  
    // Helper to collect tasks from phases
    private async getTasksFromPhases(
      phases: any[],
      startDate: Date,
      endDate: Date
    ): Promise<Task[]> {
      const phaseTasks: Task[] = [];
  
      for (const phase of phases) {
        const tasks: Task[] = await TaskModel.find({
          phaseId: phase._id,
          created: { $gte: startDate, $lte: endDate },
        });
        phaseTasks.push(...tasks);
      }
      return phaseTasks;
    }
  
    // Predict ratio for future months using linear regression
    public async predictRatio(projectId: string, userId: string | undefined) {
      const tasks: Statistic[] = await this.taskRatio(
        projectId,
        new Date(2024, 0, 1),
        new Date(2025, 0, 1),
        false,
        userId
      );
  
      const months = tasks.map(entry => entry.month);
      const ratios = tasks.map(entry => entry.amount);
  
      const regression = new SimpleLinearRegression(months, ratios);
  
      const predictedRatios: Statistic[] = [];
      for (let month = 0; month <= 11; month++) {
        const predictedRatio = regression.predict(month);
        predictedRatios.push({ year: 2025, month, amount: predictedRatio });
      }
      return predictedRatios;
    }
  
    // Other methods remain unchanged...
  
    public async createdTaskAmount(
        projectId: string,
        startDate: Date,
        endDate: Date,
        isDaily: boolean,
        userId: string | null = null
      ): Promise<Statistic[]> {
        const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId);
        const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);
      
        return this.accumulateAmounts(stats);
    }

    private accumulateAmounts(stats: Statistic[]): Statistic[] {
        let cumulativeAmount = 0;
      
        return stats.map(entry => {
          cumulativeAmount += entry.amount;
          return { ...entry, amount: cumulativeAmount };
        });
      }
  
    public async checkedTaskAmount(
      projectId: string,
      startDate: Date,
      endDate: Date,
      isDaily: boolean,
      userId: string | null = null
    ): Promise<Statistic[]> {
      const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId);
      const checkedTasks: Task[] = tasks.filter(task => task.checkedDate);
      return this.generateStatistics(checkedTasks, startDate, endDate, isDaily, task => task.checkedDate!);
    }
  
    public async taskRatio(
        projectId: string,
        startDate: Date,
        endDate: Date,
        isDaily: boolean,
        userId: string | null = null
      ): Promise<Statistic[]> {
        const tasks: Task[] = await this.getFilteredTasks(projectId, startDate, endDate, userId);
      
        // Generate statistics for task counts by month or day
        const stats = this.generateStatistics(tasks, startDate, endDate, isDaily, task => task.created);
      
        // Accumulate task status ratios (done vs total)
        return this.calculateCumulativeRatios(stats, tasks);
      }
      
      private calculateCumulativeRatios(stats: Statistic[], tasks: Task[]): Statistic[] {
        let cumulativeDone = 0;
        let cumulativeTotal = 0;
      
        return stats.map(entry => {
          // Filter tasks created up to the current entry's month or day
          const tasksUntilNow = tasks.filter(task =>
            this.isBeforeOrSame(task.created, new Date(entry.year, entry.month - 1, entry.day || 1))
          );
      
          const doneTasks = tasksUntilNow.filter(task => task.status === "done").length;
          cumulativeDone = doneTasks; // Update cumulative done count
          cumulativeTotal = tasksUntilNow.length; // Update total tasks count
      
          // Calculate the ratio (percentage of done tasks)
          const ratio = cumulativeTotal > 0 ? (cumulativeDone / cumulativeTotal) * 100 : 0;
      
          return { ...entry, amount: ratio };
        });
      }
      
      private isBeforeOrSame(date1: Date, date2: Date): boolean {
        return (
          date1.getFullYear() < date2.getFullYear() ||
          (date1.getFullYear() === date2.getFullYear() && date1.getMonth() <= date2.getMonth())
        );
      }
      
  
    private generateStatistics(
      tasks: Task[],
      startDate: Date,
      endDate: Date,
      isDaily: boolean,
      dateExtractor: (task: Task) => Date,
      options?: { ratio?: boolean }
    ): Statistic[] {
      const statsMap: { [key: string]: { done: number; total: number } } = {};
  
      tasks.forEach(task => {
        const date = dateExtractor(task);
        const key = isDaily
          ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          : `${date.getFullYear()}-${date.getMonth() + 1}`;
  
        if (!statsMap[key]) {
          statsMap[key] = { done: 0, total: 0 };
        }
  
        statsMap[key].total++;
        if (task.status === 'done') {
          statsMap[key].done++;
        }
      });
  
      const range = this.generateDateRange(startDate, endDate, isDaily);
  
      return range.map(({ year, month, day }) => {
        const key = isDaily ? `${year}-${month}-${day}` : `${year}-${month}`;
        const { done, total } = statsMap[key] || { done: 0, total: 0 };
  
        const amount = options?.ratio && total > 0 ? Math.round((done / total) * 100) : total;
        return { year, month, day, amount };
      });
    }
  
    private generateDateRange(
      startDate: Date,
      endDate: Date,
      isDaily: boolean
    ): { year: number; month: number; day?: number }[] {
      const dates: { year: number; month: number; day?: number }[] = [];
      let currentDate = new Date(startDate);
  
      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = isDaily ? currentDate.getDate() : undefined;
  
        dates.push({ year, month, day });
        currentDate.setDate(currentDate.getDate() + (isDaily ? 1 : 30));
      }
      return dates;
    }
  }