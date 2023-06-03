# TODO
* ~~CPU Object~~
* ~~GPU Object~~
+ ~~OS Object~~
+ ~~RAM Object~~
* ~~HDD Object~~
* IO (R/W Speeds)
* ~~NET Object~~
+ r/w per sec >.<
+ tx_sec, rx_sec
+ Refactor logic for better performance
+ ~~+Make a single call to si.get(valueobject)~~
+ ~~+Define valuObject~~

### Notes
-----------------------
```
---- B / 1000000000 = GB   
```



# FOR Frontend
-----------------------

### Colors
-----------------------
| Colors        | |
| ------------- |:-------------:|
| blue | #68deeeff |
| lightblue | #56939bff |
| yellow | #d4dcb2ff |
| red | #5f2719ff |


### DOTMATRIX OVERLAY
-----------------------
```
.dotmatrix {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    background-image: url(images/dotmatrix.png);
    overflow-x: hidden;
    transition: 0.5s;
    opacity: .66; //We can animte this :)
}
```

