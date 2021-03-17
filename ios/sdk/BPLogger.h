//
//  BPLogger.h
//  Backpack Live
//
//  Created by Ed Filowat on 3/4/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>



NS_ASSUME_NONNULL_BEGIN

@interface BPLogger : NSObject


+ (void) writeShitToFile:(NSString*)shit;

@end

NS_ASSUME_NONNULL_END
