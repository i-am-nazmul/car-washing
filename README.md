#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main (){
  int sourceFile , destinationFile ;
  char buffer[100];
  int byteRead ;
  sourceFile = open("input.txt" , O_RDONLY);
  if(sourceFile < 0){
    printf("Error opening the file");
    return 1;

  }


  destinationFile = open("copy.txt" , O_WRONLY |O_CREAT , 0644 );
  while(true){
    bytesRead = read(sourceFile ,buffer , sizeofbuffer());
    if(bytesRead <= 0){
      break ;
    }


    write(destinationFile , buffer , bytesRead);

  }

  close(sourceFile);
  close(destinationFile);
  return 0 ;
  


}