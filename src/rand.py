import random
s=random.randint(1000,9999)
attempts=0
for x in range(1000,9999):
    if(x==s):
        break
    attempts=attempts+1
print("passwrod is: ",s)
print("attempts required to break: ",attempts)