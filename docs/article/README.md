# 如何在同一台电脑上使用多个github账户

1. 打开gitbash

2. 检查本机是否有ssh key设置

$ cd ~/.ssh 或cd .ssh
如果没有则提示： No such file or directory
我们可以执行命令 mkdir ~/.ssh 创建 .ssh 文件夹
然后 cd ~/.ssh 进入 .ssh 路径下（ls查看当前路径文件，rm * 删除所有文件）

3. 使用Git Bash生成新的ssh key。
$ ssh-keygen -t rsa -C "lgx.8888@qq.com"  #建议填写自己真实有效的邮箱地址

在执行命令后，会出现如下语句
Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa):
意思是让你输入文件保存的路径，如果没有输入，默认就是id_rsa
我们输入 id_rsa_veznlee

然后是输入密码 #你所填写的邮箱对应的git账号密码
Enter passphrase (empty for no passphrase):
确认密码
Enter same passphrase again:

提示
Your identification has been saved in id_rsa_veznlee.
Your public key has been saved in id_rsa_veznlee.pub.
The key fingerprint is:
SHA256:J7eq+8YjmDJR1xw8Xo/Utt4pcTH78JpgKDIrhWu3HJU lgx.8888@qq.com


说明添加sshkey成功
就会在 c/Users/Administrator/.ssh 下生成 id_rsa_veznlee 和 id_rsa_veznlee.pub 两个文件


4. 重复步骤3，添加另一个账号的sshkey，

Your identification has been saved in id_rsa_lilaobiao.
Your public key has been saved in id_rsa_lilaobiao.pub.
The key fingerprint is:
SHA256:1Wzn2wymVYA2oBWzbE1vxti7Sf63llMJUhIB1LaGp/4 lgx796@qq.com

添加完成后，在 c/Users/Administrator/.ssh 下就生成了四个文件
id_rsa_veznlee
id_rsa_veznlee.pub
id_rsa_lilaobiao
id_rsa_lilaobiao.pub

完成上述操作后，登录对应的账号，把id_rsa_xxx.pub里的内容复制到git账户的sshkey里面，已有的直接替换即可。
>1. 登陆 GitHub,进入你的 Settings.
>
>2. 在左边菜单，点击 SSH and GPG keys.
>
>3. 点击 Add SSH key 按钮.
>
>4. 粘贴你的密钥到 key 输入框中.

5. 在 .ssh 目录下新建 config 文件，配置内容如下
```
# 配置veznlee
Host veznlee.com  #这里是自定义的host名称，每一个的必须不一样
HostName github.com #仓库地址，可以是ip
IdentityFile C:\Users\Administrator\.ssh\id_rsa_veznlee
PreferredAuthentications publickey
User veznlee

# 配置lilaobiao 
Host lilaobiao.com  #别名
HostName github.com #仓库地址，可以是ip
IdentityFile C:\Users\Administrator\.ssh\id_rsa_lilaobiao
PreferredAuthentications publickey
User lilaobiao
```

6. 把新生成的 key 添加到 authentication agent
ssh-add ~/.ssh/id_rsa_veznlee
ssh-add ~/.ssh/id_rsa_lilaobiao

如果提示
Could not open a connection to your authentication agent。
一般是未启 动ssh agent， 先执行一下命令启动再添加即可
eval `ssh-agent -s`


7. 打开Git Bash客户端（管理员身份运行）执行测试命令测试是否配置成功（会自动在.ssh目录生成known_hosts文件把私钥配置进去）
ssh -T git@veznlee.com
或
ssh -T git@lilaobiao.com

Hi IEIT! You've successfully authenticated, but GitHub does not provide shell access.
出现上边这句，表示链接成功

如果出现的是
The authenticity of host 'github.com (52.74.223.119)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no)? 

直接输入 yes，再按 enter 即可

如果配置有全局的用户名和邮箱，可以先删除
一旦你删除了全局用户配置，之前可用的git仓库，再提交内容时将出现如下情况
git commit -m ''

```
*** Please tell me who you are.
Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'Administrator@2016-20.(none)')
```

7. 计算机本地更改
* 取消全局 用户名/邮箱 配置
    ```
    git config –global –unset user.name
    git config –global –unset user.email
    ```
* 单独设置每个repo 用户名/邮箱
    ```
    git config user.email "xxxx@xx.com"
    git config user.name "xxxx"
    ```
> git config命令要到工程目录下（反正就是git目录）执行，否则是出错的。



7. 修改具体项目的config文件，只针对项目的仓库不是 github.com 的时候使用，比如自己搭建的代码仓库

[https://www.jianshu.com/p/4e9451b5dc11](https://www.jianshu.com/p/4e9451b5dc11)

在项目的 .git/config 文件中，有一行设置url的配置。
默认配置
url = git@github.com:singsengder/test.git

修改后
url = singsender_github.com:singsengder/test.git

修改url配置还有更简单的方式，在对应的项目中执行命令
git remote set-url origin singsender_github.com:singsengder/test.git

验证授权
$ ssh -T singsender_github.com
Hi singsengder! You've successfully authenticated, but GitHub does not provide shell access.



1、修改 .git/config 文件在当前项目下
2、在[remote“origin”]部分找到url ，将其从url = https：//github.com/rootux/ms-Dropdown.git 更改为 https：//USERNAME@github.com/rootux/ms-Dropdown.git，USERNAME是你的github用户名。保存（:wq）退出



备注：配置 github.com 和 git.oschina.net 的账号参考
[https://www.cnblogs.com/popfisher/p/5731232.html](https://www.cnblogs.com/popfisher/p/5731232.html)
[http://www.xuanfengge.com/using-ssh-key-link-github-photo-tour.html](http://www.xuanfengge.com/using-ssh-key-link-github-photo-tour.html)



1、查看git配置信息
git config --list

2、查看git用户名
git config user.name

3、查看邮箱配置
git config user.email

4、全局配置用户名
git config --global user.name "nameVal"

5、全局配置邮箱
git config --global user.email "eamil@qq.com"

6、删除某个全局配置项
git config --global --unset user.name

7、单独设置每个repo 用户名/邮箱
git config user.email "xxxx@xx.com"
git config user.name "xxxx"


单独设置每个repo 用户名/邮箱 这个步骤，就是切换到工程下，执行
git config user.email "xxxx@xx.com"
和
git config user.name "xxxx"
命令。

以后每次我GitHub／GitLab clone一个新的工程下来，都要在clone完成后，在这个工程目录下执行这两条语句来配置。
【解决办法】：
工作电脑平时使用公司的github比较多，可以把公司的账户设置为全局，
然后在单独的需要用别的账号的工程下配置对应的账号。
这样就不用频繁地做这个配置，这个全局设置与单独工程下设置地顺序不做要求

当然，你也可以在首次clone代码时就指定你用的哪个用户，命令
git clone https://username:password@你的地址
假入你要克隆项目的地址为
https://github.com/lilaobiao/lilaobiao.github.io.git
则克隆命令为
git clone https://username:password@github.com/lilaobiao/lilaobiao.github.io.git

但是一旦这样克隆代码后，你电脑上的github账户就被更改了，会导致很多别的问题，建议不要用这种方式