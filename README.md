# Queuing system model
### Just a architecture of software systems course work.

#### This web application simulates a queuing system with multiple sources, devices and buffer cells. <br>
 - Sources generate applications according to the Poisson distribution law. <br>
 - The devices process requests from sources for a random time, which is generated according to the law of uniform distribution.
 - The discipline of refusing a service request is "the oldest in the buffer". That is, if the buffer is full and a new request passes, the oldest request is deleted from the buffer.
 - The discipline of selecting service requests is LIFO.
 - Device selection discipline is "priority by device number". <br>
#### There are two ways to output results and simulation:
 - Step-by-step mode
 - Automatic mode
 
### Step-by-step mode:
![image](https://user-images.githubusercontent.com/128059854/225663347-9f81e1bd-0fdc-4f53-9ce3-cbafae35e852.png)

### Automatic mode:
![image](https://user-images.githubusercontent.com/128059854/225663538-48f59f72-5591-4b6b-862b-1cdb765c4bef.png)
 
