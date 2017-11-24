from hyper import HyperParams
from mutable import mutable

import tensorflow as tf
import numpy as np

@mutable
class CnnNet:

    def __init__(self):
        self.params = HyperParams()

    def init(self):
        self.X = tf.placeholder(tf.float32, name='in')
        # Layer 1: Convolutional. Input = 32x32x3. Output = 28x28x32.
        self.conv_layer1 = tf.layers.conv2d(self.X, filters=16, kernel_size=3, strides=2, activation=tf.nn.elu)

        # Layer 2: Convolutional. Output = 10x10x64.
        self.conv_layer2 = tf.layers.conv2d(input=self.conv_layer1, filters=32, kernel_size=3, strides=2, activation=tf.nn.elu)

        # Flatten. Input = 5x5x64. Output = 2.
        self.logits = tf.layers.dense(self.conv_layer2, units=2, name='out')

        # Predictions
        self.Y = tf.nn.softmax(self.logits)

        # Output correct
        self.y = tf.placeholder(tf.float32, name='labels')

        # Mean squared error
        self.loss = tf.nn.softmax_cross_entropy_with_logits(logits=self.logits, labels=self.y)

        # Optimization step
        self.optimize = tf.train.AdamOptimizer(learning_rate=self.params.train.r).minimize(self.loss)

        # Add to collection for model restoration
        tf.add_to_collection('Y', self.Y)
        tf.add_to_collection('loss', self.loss)
        tf.add_to_collection('optimize', self.optimize)

if __name__ == '__main__':
    nn = CnnNet()
    nn.init()