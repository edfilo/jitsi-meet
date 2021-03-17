//
//  BPLogger.m
//  Backpack Live
//
//  Created by Ed Filowat on 3/4/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "BPLogger.h"


@implementation BPLogger


+ (void) writeShitToFile:(NSString*)shit {

  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *p = [[paths firstObject] stringByAppendingPathComponent:@"log.txt"];
  NSError *error;

 // [[NSFileManager defaultManager] createFileAtPath:p contents:[@"log" dataUsingEncoding:NSUTF8StringEncoding] attributes:nil];

    NSLog(@"peter %@ %@", p, shit);

  NSFileHandle *myHandle = [NSFileHandle fileHandleForWritingAtPath:p];
  [myHandle seekToEndOfFile];

  if (@available(iOS 13.0, *)) {
    [myHandle writeData:[shit dataUsingEncoding:NSUTF8StringEncoding] error:&error];

  } else {
    // Fallback on earlier versions
  }



  if(error)
  {
      NSLog( @"error saving to %@ - %@", p, [error localizedDescription] );
  }

}

@end
