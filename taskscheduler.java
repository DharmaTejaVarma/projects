import java.util.*;
 class Taskscheduler{
    static class  Task{
        String name;
        int priority;
        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }
    }
    public static void main(String[] args){
        PriorityQueue<Task> queue = new PriorityQueue<>(new Comparator<Task>() {
            public int compare(Task t1, Task t2) {
                return Integer.compare(t1.priority, t2.priority); 
            }
    });
            queue.offer(new Task("eating",3));
            queue.offer(new Task("wokeup",1));
            queue.offer(new Task("brusing",2));
            queue.offer(new Task("go college",4));
            queue.offer(new Task("return home",7));
            queue.offer(new Task("mark attendence",6));
            queue.offer(new Task("mark attendence",5));
            queue.offer(new Task("sleep",8));
        while(!queue.isEmpty()){
            Task t = queue.poll();
            System.out.println("task:"+t.name + t.priority);
        }
    }
}
