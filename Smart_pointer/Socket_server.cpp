#include <iostream>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string>
using namespace std;
int main(){
    cout<<"Server Programming:"<<endl;
    //create a socket
    int server_Socket = socket(AF_INET,SOCK_STREAM,0);
    if(server_Socket < -1){
        cerr<<"Create socket failed \n";
        return -1;
    }
    //Defining Server Address
    struct sockaddr_in serverAddress;
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(8080); //host to network short
    serverAddress.sin_addr.s_addr = INADDR_ANY;

    //bind 
    bind(server_Socket,(struct sockaddr *)&serverAddress,sizeof(serverAddress));
    //Listen for incoming connections
    

    //Accept the connection
    //Close the lisening  socket
    //while receiving -display message
    //close the connection
    
    
    return 0;
}