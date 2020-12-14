/*
 * Copyright @ 2017-present Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "RCTBridgeWrapper.h"
    #import <CodePush/CodePush.h>

/**
 * Wrapper around RCTBridge which also implements the RCTBridgeDelegate methods,
 * allowing us to specify where the bundles are loaded from.
 */
@implementation RCTBridgeWrapper

- (instancetype)init {
    self = [super init];
    if (self) {
        _bridge
            = [[RCTBridge alloc] initWithDelegate:self
                                    launchOptions:nil];
    }

    return self;
}

#pragma mark helper methods for getting the packager URL

#if DEBUG
static NSURL *serverRootWithHost(NSString *host) {
    return
        [NSURL URLWithString:
                [NSString stringWithFormat:@"http://%@/", host]];
}

- (BOOL)isPackagerRunning:(NSString *)host {
    NSURL *url = [serverRootWithHost(host) URLByAppendingPathComponent:@"status"];

    NSLog(@"host is %@", host);

    NSURLSession *session = [NSURLSession sharedSession];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    __block NSURLResponse *response;
    __block NSData *data;

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    [[session dataTaskWithRequest:request
                completionHandler:^(NSData *d,
                                    NSURLResponse *res,
                                    __unused NSError *err) {
                    data = d;
                    response = res;
                    dispatch_semaphore_signal(semaphore);
                }] resume];
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    //DISPATCH_TIME_FOREVER
    NSString *status = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return [status isEqualToString:@"packager-status:running"];
}

- (NSString *)guessPackagerHost {


    static NSString *ipGuess;
    static dispatch_once_t dispatchOncePredicate;

    dispatch_once(&dispatchOncePredicate, ^{
            NSString *ipPath
                = [[NSBundle bundleForClass:self.class] pathForResource:@"ip"
                                                                 ofType:@"txt"];

            ipGuess
                = [[NSString stringWithContentsOfFile:ipPath
                                             encoding:NSUTF8StringEncoding
                                                error:nil]
                        stringByTrimmingCharactersInSet:
                                [NSCharacterSet newlineCharacterSet]];
        });

        NSString *host = ipGuess ?: @"localhost";

    if ([self isPackagerRunning:host]) {
        return host;
    }





    return nil;
}
#endif

#pragma mark RCTBridgeDelegate methods


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
    // In debug mode, try to fetch the bundle from the packager, or fallback to
    // the one inside the framework. The IP address for the packager host is
    // fetched from the ip.txt file inside the framework.
    //
    // This duplicates some functionality present in RCTBundleURLProvider, but
    // that mode is not designed to work inside a framework, because all
    // resources are loaded from the main bundle.


    //NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    //return [NSURL fileURLWithPath:[[paths firstObject] stringByAppendingPathComponent:@"main.jsbundle"]];



    NSString *host = @"10.0.0.133:8081";
    //@"58c1680ac91d.ngrok.io/";

    //@"10.0.0.133:8081";
    //@"ac40743bfeaa.ngrok.io";
    //@"10.0.0.133:8081";
    //@"7133a6fc94ac.ngrok.io";
    //http://7133a6fc94ac.ngrok.io/
     //http://3121c901efd0.ngrok.io
    //@"63dc6ab59248.ngrok.io";

    //http://63dc6ab59248.ngrok.io

    //@"10.0.0.133";
    //[self guessPackagerHost];



    if (host != nil  && [self isPackagerRunning:host]) {

        NSString *path = @"/index.bundle";
        NSString *query = @"platform=ios&dev=true&minify=false";
        NSURLComponents *components
            = [NSURLComponents componentsWithURL:serverRootWithHost(host)
                         resolvingAgainstBaseURL:NO];

        components.path = path;
        components.query = query;

        return components.URL;
    }



#endif

    BOOL ok = [[NSFileManager defaultManager] fileExistsAtPath:[CodePush bundleURL].path];

    NSLog(@"911 bundle is %@", ok ? @"found" : @"missig");

    /*
    return [[NSBundle bundleForClass:self.class] URLForResource:@"main"
                                                     withExtension:@"jsbundle"];
     */
    return nil;
   // return [CodePush bundleURL];
    //return [[NSBundle bundleForClass:self.class] URLForResource:@"main"  withExtension:@"jsbundle"];
}

@end
