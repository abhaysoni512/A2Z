# Source: https://www.linuxhowtos.org/C_C++/socket.htm

# Basics:

Socket Programming is a way to enable communication between two different processes over a network. It allows applications to send and receive data across the network using a standardized interface.

Note: The client needs to know of the existence of and the address of the server, but the server does not need to know the address of (or even the existence of) the client prior to the connection being established.

Note: The system calls for establishing a connection are somewhat different for the client and the server, but both involve the basic construct of a socket.

Note : A socket is one end of an interprocess communication channel. The two processes each establish their own socket.

## Steps involved in Socket Programming (client side):

1. Create a socket with the socket() system call
2. Connect the socket to the address of the server using the connect() system call
3. Send and receive data. There are a number of ways to do this, but the simplest is to use the read() and write() system calls.

## The steps involved in establishing a socket on the server side are as follows:

1. Create a socket with the socket() system call
2. Bind the socket to an address using the bind() system call. For a server socket on the Internet, an address consists of a port number on the host machine.
3. Listen for connections with the listen() system call
4. Accept a connection with the accept() system call. This call typically blocks until a client connects with the server.
5. Send and receive data. There are a number of ways to do this, but the simplest is to use the read() and write() system calls.

## Socket Types:

1. When a socket is created, the program has to specify the address domain and the socket type. Two processes can communicate with each other only if their sockets are of the same type and in the same domain.

